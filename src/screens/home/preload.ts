// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { TransformationConfig } from "./components/Sidebar";

contextBridge.exposeInMainWorld("electronAPI", {
  transformMedia: (filePath: string, config: TransformationConfig) =>
    ipcRenderer.invoke("transform-media", filePath, config),
  handleProgress: (
    callback: (
      event: Electron.IpcRendererEvent,
      progress?: number | null
    ) => void
  ) => ipcRenderer.on("progress", callback),
  openSettings: () => ipcRenderer.invoke("open-settings"),
  openLink: (url: string) => ipcRenderer.invoke("open-link", url),
});
