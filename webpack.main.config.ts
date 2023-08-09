import type { Configuration } from "webpack";

import path from "path";
import { rules } from "./webpack.rules";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require("webpack");

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.FLUENTFFMPEG_COV": false,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
};
