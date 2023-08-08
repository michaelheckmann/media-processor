import { ipcMain } from "electron";
import { transformMedia } from "./home/generate";
import { openRedactionConfig } from "./modals/redactionConfig";
import { openSettings } from "./modals/settings";
import { saveRedactionConfig } from "./redactionConfig";
import { openLink } from "./shared/common";
import { electronStoreGet, electronStoreSet } from "./shared/store";

ipcMain.handle("open-link", openLink);
ipcMain.handle("electron-store-get", electronStoreGet);
ipcMain.handle("electron-store-set", electronStoreSet);

ipcMain.handle("open-settings", openSettings);
ipcMain.handle("open-redaction-config", openRedactionConfig);

ipcMain.handle("transform-media", transformMedia);

ipcMain.handle("save-redaction-config", saveRedactionConfig);
