module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@domain": "./src/domain",
          "@infra": "./src/infra",
          "@main": "./src/main",
          "@presentation": "./src/presentation",
          "@test": "./src/test",
        },
      },
    ],
  ],
};
