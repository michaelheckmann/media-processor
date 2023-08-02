import { spawnSync } from "child_process";
import { IpcMainInvokeEvent } from "electron";

/**
 * The `openLink` function opens a link using the `open` command.
 * @param {IpcMainInvokeEvent} _ - The "_" parameter is the event object that is emitted when the main
 * process receives an IPC (Inter-Process Communication) message from the renderer process. It contains
 * information about the event, such as the sender and the message payload.
 * @param {string} link - The `link` parameter is a string that represents the URL or file path that
 * you want to open.
 */
export const openLink = (_: IpcMainInvokeEvent, link: string) => {
  spawnSync("open", [`${link}`]);
};
