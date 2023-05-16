module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "@vue/typescript/recommended",
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "vue"],
  rules: {
    // Customize your rules here
    "vue/html-self-closing": "off",
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: {
          max: 3,
        },
        multiline: {
          max: 3,
        },
      },
    ],
  },
};
