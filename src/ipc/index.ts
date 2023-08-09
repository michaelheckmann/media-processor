import { ipcMain } from "electron";
import { transformMedia } from "./home/generate";
import { openEditor } from "./modals/editor";
import { openNER } from "./modals/ner";
import { openRedactionConfig } from "./modals/redactionConfig";
import { openSettings } from "./modals/settings";
import { runNER } from "./ner";
import { saveRedactionConfig } from "./redactionConfig";
import { openLink } from "./shared/common";
import { saveFile } from "./shared/saveFile";
import { electronStoreGet, electronStoreSet } from "./shared/store";

ipcMain.handle("open-link", openLink);
ipcMain.handle("electron-store-get", electronStoreGet);
ipcMain.handle("electron-store-set", electronStoreSet);

ipcMain.handle("open-editor", openEditor);
ipcMain.handle("open-settings", openSettings);
ipcMain.handle("open-ner", openNER);
ipcMain.handle("open-redaction-config", openRedactionConfig);

ipcMain.handle("transform-media", transformMedia);

ipcMain.handle("save-redaction-config", saveRedactionConfig);
ipcMain.handle("save-file", saveFile);

ipcMain.handle("run-ner", runNER);
