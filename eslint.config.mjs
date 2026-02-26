import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import nestjsSecurityPlugin from "eslint-plugin-nestjs-security";
import nestjsTypedPlugin from "@darraghor/eslint-plugin-nestjs-typed";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import perfectionist from "eslint-plugin-perfectionist";
import testingLibrary from "eslint-plugin-testing-library";
import jestPlugin from "eslint-plugin-jest";
import globals from "globals";
import customMessagesPlugin from "./eslint-local-rules.mjs";

const tsRecommendedRules = tsPlugin.configs?.recommended?.rules ?? {};
const reactRecommendedRules = reactPlugin.configs?.recommended?.rules ?? {};
const reactHooksRecommendedRules = hooksPlugin.configs?.recommended?.rules ?? {};
const jsxA11yRecommendedRules =
  jsxA11yPlugin.configs?.recommended?.rules ??
  jsxA11yPlugin.flatConfigs?.recommended?.rules ??
  {};
const nestjsSecurityRecommendedRules = nestjsSecurityPlugin.configs?.recommended?.rules ?? {};
const nestjsTypedRecommendedRules = nestjsTypedPlugin.configs?.recommended?.rules ?? {};
const testingLibraryRecommendedRules =
  testingLibrary.configs?.["flat/react"]?.rules ??
  testingLibrary.configs?.react?.rules ??
  {};
const jestRecommendedRules =
  jestPlugin.configs?.["flat/recommended"]?.rules ??
  jestPlugin.configs?.recommended?.rules ??
  {};
const prettierRules = prettierConfig.rules ?? {};
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
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      "nestjs-security": nestjsSecurityPlugin,
      "@darraghor/nestjs-typed": nestjsTypedPlugin,
      prettier: prettierPlugin,
      "simple-import-sort": simpleImportSort,
      perfectionist,
      "testing-library": testingLibrary,
      jest: jestPlugin,
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
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...tsRecommendedRules,
      ...reactRecommendedRules,
      ...reactHooksRecommendedRules,
      ...jsxA11yRecommendedRules,
      ...nestjsSecurityRecommendedRules,
      ...nestjsTypedRecommendedRules,
      ...prettierRules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "prettier/prettier": "error",
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
  {
    files: ["**/*.{test,spec}.{js,jsx,ts,tsx}", "**/__tests__/**/*.{js,jsx,ts,tsx}"],
    rules: {
      ...testingLibraryRecommendedRules,
      ...jestRecommendedRules,
    },
  },
];
