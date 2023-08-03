import { TransformationConfig } from "@/screens/home/components/Sidebar";
import { IpcMainInvokeEvent, Notification } from "electron";
import { anonymizeTransformation } from "./transformations/anonymize";
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
      await transcribeTransformation(filePath, config);
    } else if (config.task === "anonymize") {
      await anonymizeTransformation(filePath, config);
    }

    new Notification({
      title: "Success",
      body: "Your file has been generated!",
    }).show();
    return true;
  } catch (error) {
    console.error(error);
    const title = `Error while completing task: ${config.task}`;
    const body =
      error.message || "Something went wrong while generating your file.";
    new Notification({
      title,
      body,
    }).show();
    return false;
  }
};
