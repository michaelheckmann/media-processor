import { App, MenuItemConstructorOptions } from "electron";

type Functions = {
  createWindow: () => void;
  openEditor: () => void;
  openSettings: () => void;
  goToGithub: () => void;
};

export const getMainMenuTemplate = (
  app: App,
  { createWindow, openEditor, openSettings, goToGithub }: Functions
): MenuItemConstructorOptions[] => {
  return [
    {
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        {
          label: "Settings",
          accelerator: "CmdOrCtrl+,",
          click: openSettings,
        },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "File",
      submenu: [
        {
          label: "New Window",
          accelerator: "CmdOrCtrl+N",
          click: createWindow,
        },
        {
          label: "New Editor",
          accelerator: "CmdOrCtrl+E",
          click: openEditor,
        },
        { type: "separator" },
        { role: "close" },
        { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "pasteAndMatchStyle" },
        { role: "delete" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        { type: "separator" },
        { role: "front" },
        { type: "separator" },
        { role: "window" },
      ],
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: goToGithub,
        },
      ],
    },
  ];
};
