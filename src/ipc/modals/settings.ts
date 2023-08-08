import { windows } from "@/index";
import { getWindowConfig } from "@/utils/getWindowConfig";
import { BrowserWindow } from "electron";
import "../shared/store";

declare const SETTINGS_WINDOW_WEBPACK_ENTRY: string;
declare const SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export const openSettings = () => {
  // Make sure only one settings window is open at a time
  if (windows.settings !== null) {
    windows.settings.focus();
    return;
  }

  windows.settings = new BrowserWindow(
    getWindowConfig("modal", SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY)
  );

  // and load the index.html of the app.
  windows.settings.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);

  // clear the variable when the window is closed
  windows.settings.on("closed", () => {
    windows.settings = null;
  });
};
