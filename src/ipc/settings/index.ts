import { BrowserWindow } from "electron";
import { getWindowConfig } from "../../utils/getWindowConfig";
import "../shared/store";

let settingsWindow: BrowserWindow | null = null;

declare const SETTINGS_WINDOW_WEBPACK_ENTRY: string;
declare const SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export const openSettings = () => {
  // Make sure only one settings window is open at a time
  if (settingsWindow !== null) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow(
    getWindowConfig("modal", SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY)
  );

  // and load the index.html of the app.
  settingsWindow.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);

  // clear the variable when the window is closed
  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });
};
