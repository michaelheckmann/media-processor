import { IpcMainInvokeEvent, Notification } from "electron";
import { TransformationConfig } from "../../../screens/home/components/Sidebar";
import { compressTransformation } from "./transformations/compress";
import { transcribeTransformation } from "./transformations/transcribe";
import "./utils/setupFFMPEG";

export const transformMedia = async (
  _: IpcMainInvokeEvent,
  filePath: string,
  config: TransformationConfig
) => {
  console.log("Config:", JSON.stringify({ filePath, config }, null, 2));

  try {
    if (config.task === "compress") {
      await compressTransformation(filePath, config);
    } else if (config.task === "transcribe") {
      await transcribeTransformation();
    }
    new Notification({
      title: "Success",
      body: "Your file has been generated!",
    }).show();
    return true;
  } catch (error) {
    console.error(error);
    new Notification({
      title: "Error",
      body: "Something went wrong while generating your file.",
    }).show();
    return false;
  }
};
