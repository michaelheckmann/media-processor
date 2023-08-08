// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  saveRedactionConfig: (filePath: string, fileContent: string) => {
    return ipcRenderer.invoke("save-redaction-config", filePath, fileContent);
  },
});
