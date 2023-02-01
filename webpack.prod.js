const { merge } = require("webpack-merge");
const { EnvironmentPlugin } = require("webpack");
const commonConfig = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const prodConfig = {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
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
    new EnvironmentPlugin({
      INSTAFF_MODE: "production",
    }),
    new MiniCssExtractPlugin(),
  ],
};

module.exports = merge(commonConfig, prodConfig);
