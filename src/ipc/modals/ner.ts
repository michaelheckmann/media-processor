import { windows } from "@/index";
import { getWindowConfig } from "@/utils/getWindowConfig";
import { BrowserWindow } from "electron";
import "../shared/store";

declare const NER_WINDOW_WEBPACK_ENTRY: string;
declare const NER_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export const openNER = () => {
  // Make sure only one window is open at a time
  if (windows.ner !== null) {
    windows.ner.focus();
    return;
  }

  windows.ner = new BrowserWindow(
    getWindowConfig("modal", NER_WINDOW_PRELOAD_WEBPACK_ENTRY, {
      width: 600,
      height: 600,
      resizable: true,
    })
  );

  // and load the index.html of the app.
  windows.ner.loadURL(NER_WINDOW_WEBPACK_ENTRY);

  // clear the variable when the window is closed
  windows.ner.on("closed", () => {
    windows.ner = null;
  });
};
