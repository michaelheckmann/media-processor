import { ElectronStoreKey } from "@/ipc/shared/electronStoreKey";
import { TransformationConfig } from "../components/Sidebar";

declare global {
  interface Window {
    electronAPI: {
      transformMedia: (
        filePath: string,
        config: TransformationConfig
      ) => Promise<boolean>;
      handleProgress: (
        callback: (event: Electron.IpcRendererEvent, progress?: number) => void
      ) => void;
      openSettings: () => void;
      openRedactionConfig: (filePath: string) => void;
      store: {
        get: (key: ElectronStoreKey) => Promise<string>;
        set: (key: ElectronStoreKey, val: string) => void;
      };
      openLink: (url: string) => void;
      saveRedactionConfig: (
        filePath: string,
        fileContent: string
      ) => Promise<boolean>;
      handleRedactionConfigSaved: (
        callback: (event: Electron.IpcRendererEvent, filePath: string) => void
      ) => void;
    };
  }
}
