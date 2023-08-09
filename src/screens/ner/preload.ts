// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  runNER: (scriptFilePath: string, txtFilePath: string) => {
    return ipcRenderer.invoke("run-ner", scriptFilePath, txtFilePath);
  },
});
