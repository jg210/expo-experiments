module.exports = {
  root: true,
  extends: [
    "expo",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.d.ts"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  ],
  rules: {
    "react-hooks/exhaustive-deps": ["error", {
      "additionalHooks": "(useLastPromise)"
    }]
  },
  ignorePatterns: [
    "modules/expo-experiments/android/build/"
  ],
};
