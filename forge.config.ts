import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import type { ForgeConfig } from "@electron-forge/shared-types";
import FFmpegStatic from "ffmpeg-static-electron-forge";
import path from "path";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/screens/home/index.html",
            js: "./src/screens/home/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/screens/home/preload.ts",
            },
          },
          {
            html: "./src/screens/settings/index.html",
            js: "./src/screens/settings/renderer.ts",
            name: "settings_window",
            preload: {
              js: "./src/screens/settings/preload.ts",
            },
          },
        ],
      },
    }),
    new FFmpegStatic({
      remove: true, // Required
      path: path.join(__dirname, ".webpack", "main"), // Set path of main build
    }),
  ],
};

export default config;
