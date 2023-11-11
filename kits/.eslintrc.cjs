/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    // "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:editorconfig/all",
  ],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "editorconfig"],
  root: true,
  rules: {},
};
