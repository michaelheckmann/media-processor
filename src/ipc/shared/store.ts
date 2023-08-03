import { IpcMainEvent, app } from "electron";
import fs from "fs";
import path from "path";
import { ElectronStoreKey } from "./electronStoreKey";

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
 * The function `ipcMainElectronStoreGet` retrieves the value associated with a given key from the
 * Electron store.
 * @param {ElectronStoreKey} key - The `key` parameter is the key used to access the value in the
 * Electron Store. It is a string that represents the unique identifier for the value you want to
 * retrieve from the Electron Store.
 * @returns The value associated with the given key in the Electron store.
 */
export const ipcMainElectronStoreGet = async (key: ElectronStoreKey) => {
  const contents = await parseData();
  return contents[key];
};

/**
 * The function `electronStoreGet` is a wrapper around the `ipcMainElectronStoreGet` function. It
 * retrieves a value from an Electron store by reading the contents of a file.
 * @param {IpcMainEvent} event - The `event` parameter is an object representing the event that
 * triggered the function. In this case, it is of type `IpcMainEvent`, which is an event object
 * specific to Electron's main process. It provides methods and properties related to the event, such
 * as the sender and the event's
 * @param {ElectronStoreKey} key - The `key` parameter is an ElectronStoreKey that represents the key of the value you want
 * to retrieve from the electron store.
 */
export const electronStoreGet = async (
  event: IpcMainEvent,
  key: ElectronStoreKey
) => {
  event.returnValue = ipcMainElectronStoreGet(key);
};

/**
 * The function `ipcMainElectronStoreSet` sets a value in the Electron Store by updating the contents
 * of a file with the provided key-value pair.
 * @param {ElectronStoreKey} key - The `key` parameter is the key or property name in the Electron
 * Store where you want to set the value. It is of type `ElectronStoreKey`.
 * @param {string} val - The `val` parameter is the value that you want to set for the given key in the
 * Electron Store. It can be any string value that you want to store.
 */
export const ipcMainElectronStoreSet = async (
  key: ElectronStoreKey,
  val: string
) => {
  const contents = await parseData();
  contents[key] = val;
  fs.writeFileSync(filePath, JSON.stringify(contents));
};

/**
 * The function `electronStoreSet` is a wrapper around the `ipcMainElectronStoreSet` function. It
 * sets a value in an Electron store by writing the contents of a file.
 * @param {IpcMainEvent} _ - The "_" parameter is of type IpcMainEvent. It represents the event object
 * that is emitted when an IPC (Inter-Process Communication) event is triggered in the Electron main
 * process.
 * @param {ElectronStoreKey} key - The `key` parameter is an ElectronStoreKey that represents the key or property name in
 * the data object where the value will be stored.
 * @param {string} val - The `val` parameter is the value that you want to set for the given key in the
 * Electron store.
 */
export const electronStoreSet = async (
  _: IpcMainEvent,
  key: ElectronStoreKey,
  val: string
) => {
  await ipcMainElectronStoreSet(key, val);
};
