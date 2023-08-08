import { windows } from "@/index";
import { IpcMainInvokeEvent } from "electron";
import { writeFileSync } from "fs";

export const saveRedactionConfig = async (
  _: IpcMainInvokeEvent,
  filePath: string,
  fileContent: string
) => {
  writeFileSync(filePath, fileContent);
  windows.main.webContents.send("redaction-config-saved", filePath);
  return true;
};
