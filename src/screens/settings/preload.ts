// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { ElectronStoreKey } from "@/ipc/shared/electronStoreKey";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  store: {
    get(key: ElectronStoreKey) {
      return ipcRenderer.invoke("electron-store-get", key);
    },
    set(property: string, key: ElectronStoreKey) {
      ipcRenderer.invoke("electron-store-set", property, key);
    },
  },
});
