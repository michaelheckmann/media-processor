import { windows } from "@/index";
import { getWindowConfig } from "@/utils/getWindowConfig";
import { BrowserWindow, IpcMainInvokeEvent } from "electron";
import "../shared/store";

declare const REDACTION_CONFIG_WINDOW_WEBPACK_ENTRY: string;
declare const REDACTION_CONFIG_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export const openRedactionConfig = (
  _: IpcMainInvokeEvent,
  filePath: string
) => {
  // Make sure only one redactionConfig window is open at a time
  if (windows.redactionConfig !== null) {
    windows.redactionConfig.focus();
    return;
  }

  windows.redactionConfig = new BrowserWindow(
    getWindowConfig("editor", REDACTION_CONFIG_WINDOW_PRELOAD_WEBPACK_ENTRY, {
      webPreferences: {
        nodeIntegration: true,
      },
    })
  );

  // and load the index.html of the app.
  windows.redactionConfig.loadURL(REDACTION_CONFIG_WINDOW_WEBPACK_ENTRY);

  // TODO: Open the file in the editor if filePath is not ""

  // clear the variable when the window is closed
  windows.redactionConfig.on("closed", () => {
    windows.redactionConfig = null;
  });
};
