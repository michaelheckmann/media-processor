import { ipcMainElectronStoreGet } from "@/ipc/shared/store";
import { TransformationConfig } from "@/screens/home/components/Sidebar";
import { isTranscriptJSON } from "@/utils/isTranscriptJSON";
import { Deepgram } from "@deepgram/sdk";
import { PrerecordedTranscriptionResponse } from "@deepgram/sdk/dist/types";
import { spawnSync } from "child_process";
import fs from "fs";
import { lookup } from "mime-types";
import { createTranscriptionFiles } from "../utils/createTranscriptionFiles";
import { getOutDirPath } from "../utils/getOutPaths";

/**
 * The `transcribeFile` function transcribes a file using the Deepgram API and creates transcription
 * files based on the response.
 * @param {string} pathIn - The `pathIn` parameter is a string that represents the path to the input
 * file that needs to be transcribed. It is the file that will be read and transcribed by the function.
 * @param {TransformationConfig} config - The `config` parameter is an object that contains the
 * configuration options for the transcription. It has the following properties:
 */
export const transcribeFile = async (
  pathIn: string,
  config: TransformationConfig
) => {
  const apiKey = await ipcMainElectronStoreGet("deepgramKey");
  const deepgram = new Deepgram(apiKey);
  const mimetype = lookup(pathIn);

  if (!mimetype) {
    throw new Error("Unsupported file type");
  }

  const buffer = fs.readFileSync(pathIn);
  const audioSource = { buffer, mimetype };
  console.log("Transcribing...");

  const response = await deepgram.transcription.preRecorded(audioSource, {
    punctuate: true,
    utterances: true,
    paragraphs: true,
    diarize: true,
    language: config.language,
    model: config.model,
    callback: config.callbackUrl,
  });

  if (response.err_code) {
    throw new Error(response.err_msg);
  } else {
    console.log("Transcription complete");
  }

  if (config.callbackUrl) {
    // Transcription Files are created async after the file has been generated
    return;
  }

  createTranscriptionFiles(pathIn, response);
};

/**
 * The `transcribeTransformation` function transcribes a file using the provided configuration and
 * opens the output directory.
 * @param {string} pathIn - The `pathIn` parameter is a string that represents the path to the input
 * file that needs to be transcribed.
 * @param {TransformationConfig} config - The `config` parameter is an object of type
 * `TransformationConfig`. It contains configuration options for the transcription transformation. The
 * specific properties and their types would depend on the implementation of the `TransformationConfig`
 * interface.
 */
export const transcribeTransformation = async (
  pathIn: string,
  config: TransformationConfig
) => {
  // This is the case if a transcript was created async
  // Any we just need to create the missing files
  if (isTranscriptJSON(pathIn)) {
    const data = fs.readFileSync(pathIn, "utf8");
    const jsonData = JSON.parse(data);
    const response = jsonData as PrerecordedTranscriptionResponse;
    createTranscriptionFiles(pathIn, response);
  } else {
    const outDir = getOutDirPath(pathIn, "transcription");
    await transcribeFile(pathIn, config);
    spawnSync("open", [outDir]);
  }
};
