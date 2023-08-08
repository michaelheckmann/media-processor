import { IpcMainInvokeEvent } from "electron";
import { writeFileSync } from "fs";

export const saveFile = async (
  _: IpcMainInvokeEvent,
  filePath: string,
  fileContent: string
) => {
  writeFileSync(filePath, fileContent);
  return true;
};
