const path = require("path");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { InjectManifest } = require("workbox-webpack-plugin");

const prodConfig = {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-loader",
        include: path.resolve(__dirname, "src/pages"),
      },
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
    new MiniCssExtractPlugin(),
    new InjectManifest({
      swSrc: "./src/static/instaff-sw.js",
      swDest: "instaff-service-worker.js",
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
