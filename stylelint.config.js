module.exports = {
  extends: ["stylelint-config-standard"],
  rules: {
    indentation: null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
        ],
      },
    ],
    "function-name-case": null,
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificity": null,
  },
};
