import { GenerationConfig } from "../components/Sidebar";

declare global {
  interface Window {
    electronAPI: {
      generate: (
        filePath: string,
        config: GenerationConfig
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
