// eslint.config.mjs
import js from "@eslint/js";
import * as tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  // 0) Global ignores
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/build/**"],
  },

  // 1) Base JS rules
  js.configs.recommended,

  // 2) TypeScript rules (non type-aware; easy setup)
  ...tseslint.configs.recommended,

  // 3) Frontend (Next.js) — browser env
  {
    files: ["frontend/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        // Next includes SSR but front code should primarily use browser globals
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "@next/next": nextPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@next/next/no-html-link-for-pages": "off",
    },
  },

  // 4) Backend — Node + CommonJS
  {
    files: ["backend/**/*.{js,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs", // <-- allow require/module.exports
      globals: {
        ...globals.node, // process, require, module, console, __dirname, etc.
      },
    },
    rules: {
      // Allow require() in backend JS
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // 5) Scripts — Node + ESM (.mjs)
  {
    files: ["scripts/**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module", // .mjs uses ESM
      globals: {
        ...globals.node, // process, console, etc.
      },
    },
  },

  // 6) File-specific tweaks
  // Silence Next’s generated triple-slash in this file only
  {
    files: ["frontend/next-env.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },

  // 7) Prettier last: turns off formatting rules that conflict with Prettier
  prettier,
];
