import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
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

export default tseslint.config(
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
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,cjs,mjs,jsx,ts,tsx}"],
    plugins: {
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
    },
    languageOptions: {
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
    files: ["**/*.{test,spec}.{js,jsx,ts,tsx}", "**/__tests__/**/*.{js,jsx,ts,tsx}"],
    rules: {
      ...testingLibraryRecommendedRules,
      ...jestRecommendedRules,
    },
  },
);
