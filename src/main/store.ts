import { app, ipcMain } from "electron";
import fs from "fs";
import path from "path";

const dataPath = app.getPath("userData");
const filePath = path.join(dataPath, "config.json");

async function parseData() {
  try {
    return JSON.parse(fs.readFileSync(filePath).toString());
  } catch (error) {
    return {};
  }
}

ipcMain.on("electron-store-get", async (event, val) => {
  const contents = await parseData();
  event.returnValue = contents[val];
});
ipcMain.handle("electron-store-set", async (_, key, val) => {
  const contents = await parseData();
  contents[key] = val;
  fs.writeFileSync(filePath, JSON.stringify(contents));
});
