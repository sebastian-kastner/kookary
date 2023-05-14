module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    // "prettier",
    "@vue/typescript/recommended",
    "@vue/eslint-config-typescript/recommended",
    // "plugin:prettier/recommended",
    "plugin:vue/vue3-recommended",
  ],
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    "vue/html-self-closing": "off",
    "vue/singleline-html-element-content-newline": "off",
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
