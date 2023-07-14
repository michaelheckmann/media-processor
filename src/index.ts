import { spawnSync } from "child_process";
import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { reduceFile } from "./main/generate";
import "./main/store";
import { GenerationConfig } from "./screens/home/components/Sidebar";

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

declare const SETTINGS_WINDOW_WEBPACK_ENTRY: string;
declare const SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    minHeight: 400,
    width: 800,
    minWidth: 600,
    backgroundMaterial: "acrylic",
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 22, y: 18 },
    transparent: true,
    backgroundColor: "#00000000", // transparent hexadecimal or anything with transparency,
    vibrancy: "under-window", // in my case...
    visualEffectState: "followWindow",
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle("open-settings", () => {
  if (settingsWindow !== null) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    height: 400,
    minHeight: 400,
    width: 400,
    minWidth: 400,
    backgroundMaterial: "acrylic",
    webPreferences: {
      preload: SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    titleBarStyle: "hiddenInset",
    transparent: true,
    backgroundColor: "#00000000", // transparent hexadecimal or anything with transparency,
    vibrancy: "under-window", // in my case...
    visualEffectState: "followWindow",
    maximizable: false,
    minimizable: false,
    resizable: false,
    movable: true,
  });

  // and load the index.html of the app.
  settingsWindow.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);

  // clear the variable when the window is closed
  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });
});

ipcMain.handle("open-link", (_, link) => {
  console.log("ipcMain.handle ~ link:", link);
  spawnSync("open", [`${link}`]);
});

ipcMain.handle(
  "generate",
  async (event, filePath: string, config: GenerationConfig) => {
    console.log("Config:", JSON.stringify({ filePath, config }, null, 2));

    const fileDirectory = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const fileExtension = path.extname(filePath);

    // Create a new directory in the file's directory with the name of the file, if it doesn't exist yet
    const newDirectory = path.join(
      fileDirectory,
      fileName.replace(fileExtension, "")
    );
    if (!fs.existsSync(newDirectory)) {
      fs.mkdirSync(newDirectory);
    }

    try {
      if (config.task === "reduce") {
        const reducedFilePath = path.join(
          newDirectory,
          `${fileName.replace(fileExtension, "")}_reduced${fileExtension}`
        );
        await reduceFile(filePath, reducedFilePath, config, mainWindow);
        spawnSync("open", [reducedFilePath]);
      } else if (config.task === "transcribe") {
        console.log("Transcribe");
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
);
