import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/Malnati/ops-eslint/blob/main/docs/rules/${name}.md`,
);

const DEFAULT_CODE_PATTERN = /[A-Z]{2,10}(?:[-_][A-Z0-9]+)*[-_]\d{3,5}/;
const DEFAULT_LOGGERS = ["console.error", "console.warn", "logger.error", "logger.warn"];
const DEFAULT_ERROR_CONSTRUCTORS = ["Error", "TypeError", "RangeError", "ReferenceError"];

const rule = createRule({
  name: "standardize-error-messages",
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce standardized error/log messages with unique code and catalog entries.",
    },
    schema: [
      {
        type: "object",
        properties: {
          messages: { type: "object" },
          codePattern: { type: "string" },
          loggers: { type: "array", items: { type: "string" } },
          errorConstructors: { type: "array", items: { type: "string" } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingCode:
        "Mensagem deve conter um código único (ex: APP-001/ERR_AUTH_001) presente no catálogo.",
      unknownCode:
        "Código encontrado não existe no catálogo configurado no Flat Config.",
      invalidCatalogEntry:
        "Entrada do catálogo inválida: esperados campos 'raw', 'user' e 'dev' com texto.",
      dynamicMessage:
        "Mensagem dinâmica não é permitida. Use uma string estática contendo o código.",
    },
  },
  defaultOptions: [{}],
  create(context) {
    const options = context.options?.[0] ?? {};
    const catalog =
      options.messages && typeof options.messages === "object" ? options.messages : {};
    const catalogKeys = Object.keys(catalog);
    const codePattern = options.codePattern
      ? new RegExp(options.codePattern)
      : DEFAULT_CODE_PATTERN;
    const loggers = Array.isArray(options.loggers) ? options.loggers : DEFAULT_LOGGERS;
    const errorConstructors = Array.isArray(options.errorConstructors)
      ? options.errorConstructors
      : DEFAULT_ERROR_CONSTRUCTORS;

    const report = (node, messageId) => {
      context.report({ node, messageId });
    };

    const getStaticString = (node) => {
      if (!node) return null;
      if (node.type === "Literal" && typeof node.value === "string") return node.value;
      if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
        return node.quasis[0]?.value?.cooked ?? node.quasis[0]?.value?.raw ?? "";
      }
      return null;
    };

    const hasValidCatalogEntry = (code) => {
      if (!code) return false;
      const entry = catalog?.[code];
      if (!entry || typeof entry !== "object") return false;
      return (
        typeof entry.raw === "string" &&
        entry.raw.trim().length > 0 &&
        typeof entry.user === "string" &&
        entry.user.trim().length > 0 &&
        typeof entry.dev === "string" &&
        entry.dev.trim().length > 0
      );
    };

    const validateMessage = (node, message) => {
      if (typeof message !== "string") {
        report(node, "dynamicMessage");
        return;
      }

      if (catalogKeys.length > 0) {
        const code = catalogKeys.find((key) => message.includes(key));
        if (!code) {
          report(node, "missingCode");
          return;
        }
        if (!hasValidCatalogEntry(code)) {
          report(node, "invalidCatalogEntry");
          return;
        }
        return;
      }

      if (!codePattern.test(message)) {
        report(node, "missingCode");
      }
    };

    const isLoggerCall = (node) => {
      if (node.type !== "CallExpression") return false;
      const callee = node.callee;
      if (callee.type !== "MemberExpression" || callee.computed) return false;
      if (callee.object.type !== "Identifier") return false;
      if (callee.property.type !== "Identifier") return false;
      const fullName = `${callee.object.name}.${callee.property.name}`;
      return loggers.includes(fullName);
    };

    const isErrorConstructor = (node) => {
      if (!node) return false;
      if (node.type === "NewExpression") {
        if (node.callee.type === "Identifier") {
          return errorConstructors.includes(node.callee.name);
        }
        if (node.callee.type === "MemberExpression" && node.callee.property.type === "Identifier") {
          return errorConstructors.includes(node.callee.property.name);
        }
      }
      return false;
    };

    return {
      ThrowStatement(node) {
        const argument = node.argument;
        if (!argument) return;
        if (isErrorConstructor(argument) && argument.arguments?.length) {
          const messageNode = argument.arguments[0];
          const message = getStaticString(messageNode);
          validateMessage(messageNode ?? argument, message);
          return;
        }
        if (argument.type === "Literal" || argument.type === "TemplateLiteral") {
          const message = getStaticString(argument);
          validateMessage(argument, message);
        }
      },
      CallExpression(node) {
        if (!isLoggerCall(node)) return;
        const messageNode = node.arguments?.[0];
        const message = getStaticString(messageNode);
        validateMessage(messageNode ?? node, message);
      },
    };
  },
});

const plugin = {
  rules: {
    "standardize-error-messages": rule,
  },
};

export default plugin;
