module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
    "plugin:vue/vue3-recommended",
  ],
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    // override/add rules settings here, such as:
    // "vue/no-unused-vars": "error",
  },
};
