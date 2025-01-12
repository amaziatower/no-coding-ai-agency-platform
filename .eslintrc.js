module.exports = {
  env: {
    node: true,
  },
  extends: [
    "next/core-web-vitals", // Next.js core web vitals
    "prettier", // Prettier plugin
    "molindo/typescript",
    "molindo/react",
    "molindo/tailwind",
    "plugin:@next/next/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier",
  ],
  plugins: ["jsx-a11y", "import", "prettier"],
  rules: {
    "no-console": "off", // Allow console statements
    "import/order": "off",
    "sort-destructure-keys/sort-destructure-keys": "off",
    "tailwindcss/enforces-negative-arbitrary-values": "off",
    "arrow-body-style": "off",
    "react/jsx-sort-props": "off",
    "object-shorthand": "off",
    "react-hooks/exhaustive-deps": "off",
    "tailwindcss/classnames-order": "off",
    "no-case-declarations": "off",
    "prettier/prettier": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "react-hooks/rules-of-hooks": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "react/prop-types": "off",
    "react/no-unknown-property": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "func-style": "off",
    "import/no-unresolved": "off",
    "react/button-has-type": "off",
    "jsx-a11y/anchor-has-content": "off",
    "jsx-a11y/heading-has-content": "off",
    "react/function-component-definition": "off",
    "@typescript-eslint/array-type": "off",
    "react/no-unused-prop-types": "off",
  },
  settings: {
    tailwindcss: {
      callees: ["cn"],
      config: "tailwind.config.js",
    },
    next: {
      rootDir: true,
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
    },
  ],
};