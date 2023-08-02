import { IpcMainEvent, app } from "electron";
import fs from "fs";
import path from "path";

const dataPath = app.getPath("userData");
const filePath = path.join(dataPath, "config.json");

/**
 * The function `parseData` reads and parses a JSON file from a given file path, returning the parsed
 * data or an empty object if an error occurs.
 * @returns The `parseData` function is returning a promise that resolves to the result of parsing the
 * JSON data from the file at `filePath`. If the parsing is successful, the parsed data will be
 * returned. If there is an error during parsing or reading the file, an empty object `{}` will be
 * returned.
 */
const parseData = async () => {
  try {
    return JSON.parse(fs.readFileSync(filePath).toString());
  } catch (error) {
    return {};
  }
};

/**
 * The function `electronStoreGet` retrieves a value from an Electron store based on a given key.
 * @param {IpcMainEvent} event - The `event` parameter is an object representing the event that
 * triggered the function. In this case, it is of type `IpcMainEvent`, which is an event object
 * specific to Electron's main process. It provides methods and properties related to the event, such
 * as the sender and the event's
 * @param {string} val - The `val` parameter is a string that represents the key of the value you want
 * to retrieve from the electron store.
 */
export const electronStoreGet = async (event: IpcMainEvent, val: string) => {
  const contents = await parseData();
  event.returnValue = contents[val];
};

/**
 * The function `electronStoreSet` is used to set a value in an Electron store by updating the contents
 * of a file.
 * @param {IpcMainEvent} _ - The "_" parameter is of type IpcMainEvent. It represents the event object
 * that is emitted when an IPC (Inter-Process Communication) event is triggered in the Electron main
 * process.
 * @param {string} key - The `key` parameter is a string that represents the key or property name in
 * the data object where the value will be stored.
 * @param {string} val - The `val` parameter is the value that you want to set for the given key in the
 * Electron store.
 */
export const electronStoreSet = async (
  _: IpcMainEvent,
  key: string,
  val: string
) => {
  const contents = await parseData();
  contents[key] = val;
  fs.writeFileSync(filePath, JSON.stringify(contents));
};
