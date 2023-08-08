import { TransformationConfig } from "@/screens/home/components/Sidebar";
import { PrerecordedTranscriptionResponse } from "@deepgram/sdk/dist/types";
import { spawnSync } from "child_process";
import ffmpeg from "fluent-ffmpeg";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { onEnd, onError, onProgress } from "../utils/ffmpegOptions";
import { getOutFilePath } from "../utils/getOutPaths";

type RedactionTimestamps = {
  start: number;
  end: number;
}[];

/**
 * The `cleanRedactionConfig` function removes certain lines from a redaction configuration file and
 * returns the modified file content as a string.
 * @param {string} redactionConfigFileContent - The `redactionConfigFileContent` parameter is a string
 * that represents the content of a redaction configuration file. This file contains multiple lines of
 * text, where each line represents a rule or configuration for redacting certain information.
 * @returns The function `cleanRedactionConfig` returns a string that represents the cleaned version of
 * the `redactionConfigFileContent`.
 */
const cleanRedactionConfig = (redactionConfigFileContent: string) => {
  let newFile = "";
  const lines = redactionConfigFileContent.split("\n");
  lines.forEach((line) => {
    if (line.startsWith("Speaker ")) {
      return;
    }

    if (line.startsWith("// ")) {
      return;
    }
    if (line.includes(" --> ")) {
      return;
    }
    if (line === "") {
      return;
    }

    newFile += line + " ";
  });
  return newFile;
};

/**
 * The function `getRedactionTimestamps` takes a redaction configuration string and  transcript JSON object, and returns an array of redaction timestamps based on the configuration.
 * @param {string} redactionConfig - A string that represents the redaction configuration. It contains a series of words separated by spaces. Each word can have special characters to indicate the start and end of a redaction, as well as to indicate if a word should be replaced.
 * @param {PrerecordedTranscriptionResponse} transcriptJSON - The `transcriptJSON` parameter is of type `PrerecordedTranscriptionResponse`. It represents the JSON response of  a prerecorded transcription.
 * @returns an array of redaction timestamps.
 */
const getRedactionTimestamps = (
  redactionConfig: string,
  transcriptJSON: PrerecordedTranscriptionResponse
) => {
  // Split the redaction config string into an array of words.
  const words = redactionConfig.split(" ");

  // Get the transcription words from the transcript JSON object.
  const transcriptionsWords =
    transcriptJSON.results.channels[0].alternatives[0].words;

  // Initialize variables.
  const redactionConfigArray: RedactionTimestamps = [];
  let wordIndex = 0;
  let redactionStart: number;
  let redactionEnd: number;
  let replacement = false;

  // Loop through each word in the redaction config array.
  words.forEach((word) => {
    // If the word contains "[", set the redaction start time.
    if (word.includes("[") && !redactionStart) {
      const transcriptionWord = transcriptionsWords[wordIndex];
      redactionStart = transcriptionWord.start;
    }

    // If the word contains "]", set the redaction end time and add the redaction timestamps to the array.
    if (word.includes("]") && !redactionEnd) {
      const transcriptionWord = transcriptionsWords[wordIndex];
      redactionEnd = transcriptionWord.end;
      redactionConfigArray.push({
        start: redactionStart,
        end: redactionEnd,
      });
      redactionStart = undefined;
      redactionEnd = undefined;
      wordIndex++;
      return;
    }

    // If the word contains "(", set the replacement flag to true.
    if (word.includes("(")) {
      replacement = true;
      return;
    }

    // If the word contains ")", set the replacement flag to false.
    if (word.includes(")")) {
      replacement = false;
      return;
    }

    // If the replacement flag is true, skip the current word.
    if (replacement) {
      return;
    }

    // Increment the word index.
    wordIndex++;
  });

  // Return the redaction timestamps array.
  return redactionConfigArray;
};

/**
 * The `getRedactedTranscript` function takes a transcript file content and a redaction configuration as input, and returns a redacted
 * version of the transcript based on the configuration.
 * @param {string} transcriptFileContent - The `transcriptFileContent` parameter is a string that represents the content of a transcript
 * file. It contains the text of the transcript, with each line representing a different part of the transcript.
 * @param {string} redactionConfig - The `redactionConfig` parameter is a string that contains the configuration for redacting certain words
 * or phrases in the transcript. It specifies which words or phrases should be redacted and how they should be replaced.
 * @returns The function `getRedactedTranscript` returns a redacted version of the transcript file content.
 */
const getRedactedTranscript = (
  transcriptFileContent: string,
  redactionConfig: string
) => {
  let redactionConfigIndex = 0;
  let isRedacting = false;

  const redactionConfigWords = redactionConfig.split(" ");

  return transcriptFileContent
    .split("\n")
    .map((line) => {
      if (line.startsWith("WEBVTT")) {
        return line;
      }

      if (line.includes(" --> ")) {
        return line;
      }

      if (line === "") {
        return line;
      }

      // If the line starts with a <, it contains a speaker name.
      // Extract it from the line and store it
      let speakerPrefix = "";
      if (line.startsWith("<")) {
        const speakerPrefixEndIndex = line.indexOf(">") + 1;
        speakerPrefix = line.slice(0, speakerPrefixEndIndex);
        line = line.slice(speakerPrefixEndIndex);
      }

      const words = line.split(" ");
      const newLine = speakerPrefix ? [speakerPrefix] : [];

      words.forEach((word) => {
        const redactionConfigWord = redactionConfigWords[redactionConfigIndex];

        if (redactionConfigWord.includes("]")) {
          const slicedWords = redactionConfigWords.slice(redactionConfigIndex);
          const replacementWordStart = slicedWords.findIndex((word) =>
            word.includes("(")
          );
          const replacementWordEnd =
            slicedWords.findIndex((word) => word.includes(")")) + 1;

          const replacementWord = slicedWords
            .slice(replacementWordStart, replacementWordEnd)
            .join(" ")
            // Only keep the words inside the round brackets
            .replace(/.*\((.*)\).*/, "$1");

          newLine.push(`[${replacementWord}]`);
          redactionConfigIndex += replacementWordEnd;
          isRedacting = false;
          return;
        }

        if (redactionConfigWord.includes("[")) {
          isRedacting = true;
        }

        if (isRedacting) {
          redactionConfigIndex++;
          return;
        }

        newLine.push(word);
        redactionConfigIndex++;
      });

      if (isRedacting) {
        newLine.push("[...]");
      }

      return newLine.join(" ");
    })
    .join("\n");
};

/**
 * The function creates a redaction command based on a given configuration of timestamps.
 * @param {RedactionTimestamps} redactionConfig - The `redactionConfig` parameter is an array of
 * objects that contain the following properties:
 * @returns The function `createRedactionCommand` returns an array of strings. Each string in the array
 * represents a redaction command that can be used to redact audio timestamps based on the provided
 * `redactionConfig`.
 */
function createRedactionCommand(redactionConfig: RedactionTimestamps) {
  return redactionConfig.map((config) => {
    const startMS = Math.floor(config.start * 1000);
    const endMS = Math.ceil(config.end * 1000);
    const durationMS = endMS - startMS;

    const startS = Math.floor(config.start * 1000) / 1000;
    const endS = Math.ceil(config.end * 1000) / 1000;
    return `volume=enable='between(t,${startS},${endS})':volume=0[main];sine=d=${durationMS}ms:f=800, adelay=${startMS}ms,volume=0.1[beep];[main][beep]amix=inputs=2:normalize=0`;
  });
}

/**
 * The `redactAudio` function takes in an input audio file, applies redaction based on specified
 * timestamps, and saves the modified audio to an output file.
 * @param {string} pathIn - The `pathIn` parameter is a string that represents the path to the input
 * audio file that needs to be redacted.
 * @param {string} pathOut - The `pathOut` parameter is a string that represents the path where the
 * redacted audio file will be saved.
 * @param {RedactionTimestamps} redactionTimestamps - An object that contains the timestamps at which
 * the audio should be redacted. It could have the following structure:
 * @param {TransformationConfig} config - The `config` parameter is an object that contains various
 * configuration options for the audio redaction process. It may have the following properties:
 * @returns a Promise that resolves to void.
 */
const redactAudio = (
  pathIn: string,
  pathOut: string,
  redactionTimestamps: RedactionTimestamps,
  config: TransformationConfig
) => {
  let totalTime = 0;

  return new Promise<void>((resolve, reject) => {
    const redactionCommand = createRedactionCommand(redactionTimestamps);
    const ffmpegCommand =
      config.trimTo === ""
        ? ffmpeg(pathIn)
        : ffmpeg(pathIn).setDuration(config.trimTo);

    ffmpegCommand
      .audioFilters(redactionCommand)
      .on("codecData", (data) => {
        totalTime = parseInt(data.duration.replace(/:/g, ""));
      })
      .on("progress", (progress) => onProgress(progress, totalTime))
      .on("error", (err) => onError(err, reject))
      .on("end", () => onEnd(resolve))
      .save(pathOut);
  });
};
/**
 * The `redactTransformation` function takes in a file path and a configuration object, reads and
 * processes various files, performs audio redaction based on the configuration, and writes the
 * redacted audio and transcript to new files.
 * @param {string} pathIn - The `pathIn` parameter is a string that represents the input file path. It
 * is the path to the file that needs to be redacted.
 * @param {TransformationConfig} config - The `config` parameter is an object that contains the
 * configuration for the redaction transformation. It includes the following properties:
 */

export const redactTransformation = async (
  pathIn: string,
  config: TransformationConfig
) => {
  const pathOut = getOutFilePath(pathIn, "redacted");

  const dirName = path.dirname(config.redactionConfigFile);
  const redactionConfigFileName = config.redactionConfigFile;
  const redactionConfigFileContent = readFileSync(
    redactionConfigFileName,
    "utf8"
  );
  const redactionConfig = cleanRedactionConfig(redactionConfigFileContent);

  const deepgramResponseFileName = dirName + "/transcript.json";
  const deepgramResponseFileContent = readFileSync(
    deepgramResponseFileName,
    "utf-8"
  );
  const deepgramResponse = JSON.parse(
    deepgramResponseFileContent
  ) as PrerecordedTranscriptionResponse;

  const transcriptFileName = dirName + "/dovetail.vtt";
  const transcriptFileContent = readFileSync(transcriptFileName, "utf-8");

  const redactionTimestamps = getRedactionTimestamps(
    redactionConfig,
    deepgramResponse
  );

  const redactedTranscript = getRedactedTranscript(
    transcriptFileContent,
    redactionConfig
  );

  await redactAudio(pathIn, pathOut, redactionTimestamps, config);
  writeFileSync(
    getOutFilePath(transcriptFileName, "redacted"),
    redactedTranscript
  );
  spawnSync("open", [pathOut]);
};
