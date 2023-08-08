// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { TransformationConfig } from "./components/Sidebar";

contextBridge.exposeInMainWorld("electronAPI", {
  transformMedia: (filePath: string, config: TransformationConfig) => {
    return ipcRenderer.invoke("transform-media", filePath, config);
  },
  handleProgress: (
    cb: (event: Electron.IpcRendererEvent, progress?: number | null) => void
  ) => {
    return ipcRenderer.on("progress", cb);
  },
  openSettings: () => {
    return ipcRenderer.invoke("open-settings");
  },
  openEditor: () => {
    return ipcRenderer.invoke("open-editor");
  },
  openRedactionConfig: (filePath: string) => {
    return ipcRenderer.invoke("open-redaction-config", filePath);
  },
  openLink: (url: string) => {
    return ipcRenderer.invoke("open-link", url);
  },
  handleRedactionConfigSaved: (
    cb: (event: Electron.IpcRendererEvent, filePath: string) => void
  ) => {
    return ipcRenderer.on("redaction-config-saved", cb);
  },
});
