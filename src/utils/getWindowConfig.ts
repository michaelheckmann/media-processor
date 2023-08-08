import { BrowserWindowConstructorOptions } from "electron";

const sharedConfig: BrowserWindowConstructorOptions = {
  backgroundMaterial: "acrylic",
  titleBarStyle: "hiddenInset",
  transparent: true,
  backgroundColor: "#00000000", // transparent hexadecimal or anything with transparency,
  vibrancy: "under-window", // in my case...
  visualEffectState: "active",
};

const mainConfig: BrowserWindowConstructorOptions = {
  height: 600,
  minHeight: 400,
  width: 800,
  minWidth: 600,
  trafficLightPosition: { x: 22, y: 18 },
  ...sharedConfig,
};

const modalConfig: BrowserWindowConstructorOptions = {
  height: 400,
  minHeight: 400,
  width: 400,
  minWidth: 400,
  maximizable: false,
  minimizable: false,
  resizable: false,
  movable: true,
  ...sharedConfig,
};

const editorConfig: BrowserWindowConstructorOptions = {
  height: 800,
  minHeight: 400,
  width: 1000,
  minWidth: 400,
  ...sharedConfig,
};

/**
 * The function `getWindowConfig` returns a configuration object for a browser window based on the
 * specified type, preload script, and optional options.
 * @param {"main" | "modal"} type - The `type` parameter is a string that specifies the type of window
 * configuration. It can have two possible values: "main" or "modal".
 * @param {string} preload - The `preload` parameter is a string that represents the path to a
 * JavaScript file that will be loaded before the main script in the renderer process. This file can be
 * used to expose additional APIs or modify the global environment in the renderer process.
 * @param {BrowserWindowConstructorOptions} [options] - The `options` parameter is an optional object
 * that allows you to provide additional configuration options for the `BrowserWindow`. These options
 * will be merged with the default configuration options specified in `mainConfig` or `modalConfig`.
 * @returns The `getWindowConfig` function returns a configuration object for a browser window based on
 * the specified type, preload script, and optional options.
 */
export const getWindowConfig = (
  type: "main" | "modal" | "editor",
  preload: string,
  options?: BrowserWindowConstructorOptions
) => {
  const config = {
    main: mainConfig,
    modal: modalConfig,
    editor: editorConfig,
  }[type];

  return {
    ...config,
    ...options,
    webPreferences: {
      preload,
      ...options?.webPreferences,
    },
  };
};
