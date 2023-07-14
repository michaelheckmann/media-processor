// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  store: {
    get(key: string) {
      return ipcRenderer.sendSync("electron-store-get", key);
    },
    set(property: string, val: string) {
      ipcRenderer.invoke("electron-store-set", property, val);
    },
  },
});
