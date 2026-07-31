module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    // parser: "babel-eslint"
    parser: '@babel/eslint-parser', // <<< NEW PARSER
    requireConfigFile: false, // Often needed for basic Babel setups with Vue CLI v5+
    ecmaVersion: 2020, // Or newer, align with your project needs
    sourceType: 'module'
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prettier/prettier": "off"
  }
};
