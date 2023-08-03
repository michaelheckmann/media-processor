import { ipcMain } from "electron";
import { transformMedia } from "./home/generate";
import { openSettings } from "./settings";
import { openLink } from "./shared/common";
import { electronStoreGet, electronStoreSet } from "./shared/store";

ipcMain.handle("open-link", openLink);
ipcMain.handle("electron-store-get", electronStoreGet);
ipcMain.handle("electron-store-set", electronStoreSet);

ipcMain.handle("open-settings", openSettings);

ipcMain.handle("transform-media", transformMedia);
