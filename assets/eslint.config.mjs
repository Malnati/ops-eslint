import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import nestjsSecurity from "eslint-plugin-nestjs-security";
import nestjsTyped from "@darraghor/eslint-plugin-nestjs-typed";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import perfectionist from "eslint-plugin-perfectionist";
import jest from "eslint-plugin-jest";
import testingLibrary from "eslint-plugin-testing-library";
import globals from "globals";
import customMessagesPlugin from "./eslint-local-rules.mjs";

const tsRecommendedRules = tsPlugin.configs?.recommended?.rules ?? {};
const nestjsTypedPlugin = nestjsTyped.plugin || nestjsTyped;

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
      prettier: prettierPlugin,
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
      "prettier/prettier": "warn",
    },
  },

  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...(react.configs.flat?.recommended?.rules ?? {}),
      ...(reactHooks.configs?.["recommended-latest"]?.rules ?? {}),
      ...(jsxA11y.flatConfigs?.recommended?.rules ?? {}),
    },
    settings: {
      react: { version: "detect" },
    },
  },

  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "nestjs-security": nestjsSecurity.plugin || nestjsSecurity,
      "@darraghor/nestjs-typed": nestjsTypedPlugin,
    },
    rules: {
      "nestjs-security/require-guards": "warn",
      "nestjs-security/no-missing-validation-pipe": "warn",
      "nestjs-security/require-throttler": "warn",
      "nestjs-security/require-class-validator": "warn",
      "nestjs-security/no-exposed-private-fields": "warn",
      "nestjs-security/no-exposed-debug-endpoints": "warn",
    },
  },

  {
    files: [
      "**/*.{test,spec}.{js,ts,jsx,tsx}",
      "**/__tests__/**/*.{js,ts,jsx,tsx}",
    ],
    plugins: jest.configs["flat/recommended"].plugins,
    rules: jest.configs["flat/recommended"].rules,
  },

  {
    files: [
      "**/*.{test,spec}.{jsx,tsx}",
      "**/__tests__/**/*.{jsx,tsx}",
    ],
    plugins: testingLibrary.configs["flat/react"].plugins,
    rules: testingLibrary.configs["flat/react"].rules,
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

  prettierConfig,
];
