const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = (env) => {
  const devtool = env.mode === "development" ? "source-map" : false;
  return {
    mode: env.mode,
    devtool,
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
      filename: "[name][contenthash].js",
      assetModuleFilename: "assets/[name][ext]",
      clean: true,
    },
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
          test: /\.(scss|css)$/,
          use: [
            env.mode === "development"
              ? "style-loader"
              : MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
          ],
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
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
      new MiniCssExtractPlugin(),
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
};

module.exports = config;
