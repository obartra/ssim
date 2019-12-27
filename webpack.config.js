const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts"]
  },
  output: {
    filename: "ssim.web.js",
    library: "ssim",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist")
  }
};
