const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "[name][contenthash].js",
    assetModuleFilename: "assets/[name][ext]",
    clean: true,
  },
  plugins: [
    new Dotenv({
      systemvars: true,
    }),

    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),

    new CopyPlugin({
      patterns: [
        {
          from: "./src/static/",
          to: "static",
        },
      ],
    }),
  ],
};

module.exports = config;
