import type {
  Paragraph,
  PrerecordedTranscriptionResponse,
  WordBase,
} from "@deepgram/sdk/dist/types";
import fs from "fs";

type ParagraphWithSpeaker = Paragraph & { speaker: number };

/**
 * The `secondToTimestamp` function converts a number of seconds into a timestamp format of hours,
 * minutes, seconds, and milliseconds.
 * @param {number} seconds - The `seconds` parameter is a number representing the total number of
 * seconds.
 * @returns a formatted timestamp string in the format "HH:MM:SS.MMM" where HH represents hours, MM
 * represents minutes, SS represents seconds, and MMM represents milliseconds.
 */
export function secondToTimestamp(seconds: number) {
  const padZero = (num: number | string, size: number, start = true) => {
    let padded = num.toString();
    while (padded.length < size) {
      padded = (start ? "0" : "") + padded + (start ? "" : "0");
    }
    return padded;
  };

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const parsedMiliSeconds = seconds.toString().split(".");

  let remainingMiliSeconds = "000";
  if (parsedMiliSeconds.length > 1) {
    remainingMiliSeconds = parsedMiliSeconds[1].slice(0, 3);
  }

  const formattedHours = padZero(hours, 2);
  const formattedMinutes = padZero(minutes, 2);
  const formattedSeconds = padZero(Math.floor(remainingSeconds), 2);
  const formattedMilliseconds = padZero(remainingMiliSeconds, 3, false);

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

/**
 * The function `createTextFile` takes a transcript object and an output directory as input, and
 * creates a text file containing the transcript with timestamps and speaker information.
 * @param {PrerecordedTranscriptionResponse} transcript - The `transcript` parameter is an object that
 * contains the transcription response. It should have the following structure:
 * @param {string} outDir - The `outDir` parameter is a string that represents the output directory
 * where the text file will be created. It specifies the path to the directory where the transcript.txt
 * file will be saved.
 */
export function createTextFile(
  transcript: PrerecordedTranscriptionResponse,
  outDir: string
) {
  const [channel] = transcript.results.channels;
  const [alternative] = channel.alternatives;
  const { paragraphs } = alternative.paragraphs;

  const text = paragraphs.map((paragraph) => {
    const { sentences, start, end, speaker } =
      paragraph as ParagraphWithSpeaker;
    let text = `${secondToTimestamp(start)} --> ${secondToTimestamp(end)}\n`;
    text += `Speaker ${speaker}\n\n`;
    text += sentences.map((sentence) => sentence.text).join(" ");
    return text;
  });

  fs.writeFileSync(`${outDir}/transcript.txt`, text.join("\n\n"));
}

/**
 * The function `createCustomVTT` takes a JSON file path as input, reads the JSON file, parses it, and
 * creates a custom VTT file based on the contents of the JSON file. This custom VTT file is used to
 * display the transcript correctly in Dovetail.
 * @param {string} jsonPath - The `jsonPath` parameter is a string that represents the file path of the
 * JSON file containing the transcript data.
 * @returns {string} - The `createCustomVTT` function returns a string that represents the custom VTT
 * file.
 */
export function createCustomVTT(jsonPath: string) {
  // Read the files from the paths and store them in variables
  let vtt = "WEBVTT\n\n";
  const json = fs.readFileSync(jsonPath, "utf-8");

  // Parse the json file and store the paragraphs in a variable
  const { results } = JSON.parse(json);
  const { words } = results.channels[0].alternatives[0];

  const maxWordsInLine = 8;

  let line = "";
  let wordsInLine = 0;
  let currentStartTime = "";
  let currentEndTime = "";
  let currentSpeakerName = "";

  words.forEach((word: WordBase, index: number) => {
    const { start, end, speaker, punctuated_word } = word;
    const startTime = secondToTimestamp(start);
    const endTime = secondToTimestamp(end);
    const speakerName = `<v Speaker ${speaker}>`;

    if (
      index !== 0 &&
      (wordsInLine === maxWordsInLine || currentSpeakerName !== speakerName)
    ) {
      vtt += `${currentStartTime} --> ${currentEndTime}\n`;
      line = line.trim();
      vtt += `${line}\n\n`;
      wordsInLine = 0;
      line = "";
    }

    if (wordsInLine === 0) {
      if (index === 0 || currentSpeakerName !== speakerName) {
        line += `${currentSpeakerName || speakerName}`;
      }
      currentStartTime = startTime;
      currentSpeakerName = speakerName;
    }

    line += `${punctuated_word} `;
    wordsInLine++;
    currentEndTime = endTime;

    if (index === words.length - 1) {
      vtt += `${currentStartTime} --> ${currentEndTime}\n`;
      line = line.trim();
      vtt += `${line}\n\n`;
      wordsInLine = 0;
      line = "";
    }
  });

  // Write the new vtt file
  const newFileName = jsonPath.replace(".json", "-custom.vtt");
  fs.writeFileSync(newFileName, vtt);
}

/**
 * The function `createSentenceFile` reads a JSON file, extracts the sentences from it, and writes them
 * to a new text file. This file is used by the NER script to extract named entities from the transcript.
 * @param {string} jsonPath - The `jsonPath` parameter is a string that represents the file path of the
 * JSON file that contains the data you want to process.
 */
export function createSentenceFile(jsonPath: string) {
  const json = fs.readFileSync(jsonPath, "utf-8");

  // Parse the json file and store the paragraphs in a variable
  const { results } = JSON.parse(json);
  const { paragraphs } = results.channels[0].alternatives[0].paragraphs;
  const sentences = paragraphs.flatMap((paragraph: Paragraph) =>
    paragraph.sentences.map((sentence) => sentence.text)
  );

  // Write the txt file
  const newFileName = jsonPath.replace(".json", "-sentences.txt");
  fs.writeFileSync(newFileName, sentences.join("\n"));
}
