module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript",
  ],
  plugins: [
    // "@babel/proposal-export-default-from",
    ["@babel/plugin-proposal-decorators", { "legacy": true } ],
    ["@babel/proposal-class-properties", { "loose": true } ],
    "@babel/proposal-object-rest-spread",
    "@babel/plugin-syntax-dynamic-import",
  ],
  ignore: [
    "**/*.d.ts",
    "**/__tests__/",
  ],
  env: {
    "es2015": {
      presets: [
        ["@babel/preset-env", { "modules": false } ],
        "@babel/preset-typescript",
      ],
      plugins: [
        ["@babel/plugin-proposal-decorators", { "legacy": true } ],
        ["@babel/proposal-class-properties", { "loose": true } ],
        "@babel/proposal-object-rest-spread",
        "@babel/plugin-syntax-dynamic-import",
      ],
      ignore: [
        "**/*.d.ts",
        "**/__tests__/",
      ],
    }
  }
};
