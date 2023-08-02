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
      store: {
        get: (key: string) => string;
        set: (key: string, val: string) => void;
      };
      openLink: (url: string) => void;
    };
  }
}
