import { windows } from "@/index";
import { getWindowConfig } from "@/utils/getWindowConfig";
import { BrowserWindow } from "electron";
import "../shared/store";

declare const EDITOR_WINDOW_WEBPACK_ENTRY: string;
declare const EDITOR_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export const openEditor = () => {
  windows.editor = new BrowserWindow(
    getWindowConfig("editor", EDITOR_WINDOW_PRELOAD_WEBPACK_ENTRY)
  );

  // and load the index.html of the app.
  windows.editor.loadURL(EDITOR_WINDOW_WEBPACK_ENTRY);

  // clear the variable when the window is closed
  windows.editor.on("closed", () => {
    windows.editor = null;
  });
};
