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

const getRedactionTimestamps = (
  redactionConfig: string,
  transcriptJSON: PrerecordedTranscriptionResponse
) => {
  const words = redactionConfig.split(" ");
  const transcriptionsWords =
    transcriptJSON.results.channels[0].alternatives[0].words;
  const redactionConfigArray: RedactionTimestamps = [];

  let wordIndex = 0;
  let redactionStart: number;
  let redactionEnd: number;

  let replacement = false;

  words.forEach((word) => {
    if (word.includes("[") && !redactionStart) {
      const transcriptionWord = transcriptionsWords[wordIndex];
      redactionStart = transcriptionWord.start;
    }

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

    if (word.includes("(")) {
      replacement = true;
      return;
    }

    if (word.includes(")")) {
      replacement = false;
      return;
    }

    if (replacement) {
      return;
    }

    wordIndex++;
  });

  return redactionConfigArray;
};

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
  console.log("redactionConfig:", redactionConfig);

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
