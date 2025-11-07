module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: "defaults, ie 11, not dead",
        useBuiltIns: "usage",
        corejs: 3
      }
    ]
  ]
};
