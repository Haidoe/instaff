const path = require("path");
const { merge } = require("webpack-merge");
const { EnvironmentPlugin } = require("webpack");
const commonConfig = require("./webpack.common.js");
const Dotenv = require("dotenv-webpack");

const devConfig = {
  mode: "development",
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-loader",
        include: path.resolve(__dirname, "src/pages"),
      },
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(jpg|jpeg|svg|png)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new EnvironmentPlugin({
      INSTAFF_MODE: "development",
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
