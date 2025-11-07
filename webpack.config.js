// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    entry: { main: path.resolve(__dirname, "src/pages/index.js") },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "assets/js/[name].[contenthash].js" : "assets/js/[name].js",
      assetModuleFilename: "assets/[name][ext][query]",
      clean: true
    },
    mode: isProd ? "production" : "development",
    devtool: isProd ? "source-map" : "inline-source-map",

    devServer: {
      static: { directory: path.resolve(__dirname, "dist") },
      hot: false,                 // ✅ disable HMR (prevents duplicated listeners/state)
      liveReload: true,           // full reload on save
      historyApiFallback: true,
      open: true,
      port: 8080,
      client: { overlay: true }   // show build errors in the browser
    },

    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, use: "babel-loader" },

        // ✅ Extract CSS in BOTH dev & prod (no style-loader, no CSS HMR)
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"]
        },

        { test: /\.(png|jpe?g|gif|svg|webp|woff2?|ttf|eot)$/i, type: "asset/resource" }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({ template: path.resolve(__dirname, "src/index.html") }),
      new MiniCssExtractPlugin({
        filename: isProd ? "assets/css/[name].[contenthash].css" : "assets/css/[name].css"
      })
    ]
  };
};
