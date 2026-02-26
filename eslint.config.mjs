import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import perfectionist from "eslint-plugin-perfectionist";
import globals from "globals";
import customMessagesPlugin from "./eslint-local-rules.mjs";

const tsRecommendedRules = tsPlugin.configs?.recommended?.rules ?? {};
const errorMessageCatalog = {
  ERR_AUTH_001: {
    raw: "Unauthorized: Token expired",
    user: "Sua sessão expirou. Por favor, faça login novamente. Suporte: suporte@empresa.com",
    dev: "JWT expirado no middleware de auth. Verifique o TTL do provider.",
  },
};

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/.eslint/**",
      "**/*.min.js",
    ],
  },
  eslint.configs.recommended,
  {
    files: ["**/*.{js,cjs,mjs,jsx,ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      "simple-import-sort": simpleImportSort,
      perfectionist,
      "custom-messages": customMessagesPlugin,
    },
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...tsRecommendedRules,
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "perfectionist/sort-objects": "warn",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "custom-messages": customMessagesPlugin,
    },
    rules: {
      "custom-messages/standardize-error-messages": [
        "error",
        {
          messages: errorMessageCatalog,
        },
      ],
    },
  },
];
