import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/Malnati/ops-eslint/blob/main/docs/rules/${name}.md`,
);

const MIN_LENGTH = 2;

const rule = createRule({
  name: "no-hardcoded-strings",
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hardcoded string literals.",
    },
    schema: [],
    messages: {
      hardcoded: "Avoid hardcoded string literals; move to constants or catalog.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== "string") return;
        if (node.value.length < MIN_LENGTH) return;
        context.report({ node, messageId: "hardcoded" });
      },
    };
  },
});

const plugin = {
  rules: {
    "no-hardcoded-strings": rule,
  },
};

export default plugin;
