import { toWebVTT } from "@/utils/toWebVTT";
import type {
  Paragraph,
  PrerecordedTranscriptionResponse,
  WordBase,
} from "@deepgram/sdk/dist/types";
import fs from "fs";
import { secondToTimestamp } from "../utils/secondToTimestamp";
import { getOutDirPath } from "./getOutPaths";

type ParagraphWithSpeaker = Paragraph & { speaker: number };

/**
 * The `createTextFile` function takes a transcript object and a file path as input, and creates a text
 * file with the transcript content.
 * @param {PrerecordedTranscriptionResponse} transcript - The `transcript` parameter is an object that
 * represents the transcription of a prerecorded audio or video file. It contains information about the
 * transcribed text, such as the channels, alternatives, paragraphs, sentences, start and end
 * timestamps, and speaker information.
 * @param {string} pathOut - The `pathOut` parameter is a string that represents the file path where
 * the text file will be created. It should include the file name and extension (e.g., "output.txt").
 */
const createTextFile = (
  transcript: PrerecordedTranscriptionResponse,
  pathOut: string
) => {
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

  fs.writeFileSync(pathOut, text.join("\n\n"));
};

/**
 * The `createDovetailVTT` function takes a transcript and a file path as input, and generates a VTT
 * (WebVTT) file with speaker labels and timestamps.
 * @param {PrerecordedTranscriptionResponse} transcript - The `transcript` parameter is an object that
 * contains the transcription results.
 * @param {string} pathOut - The `pathOut` parameter is a string that represents the file path where
 * the generated VTT file will be saved.
 */
const createDovetailVTT = (
  transcript: PrerecordedTranscriptionResponse,
  pathOut: string
) => {
  let vtt = "WEBVTT\n\n";

  const { results } = transcript;
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
  fs.writeFileSync(pathOut, vtt);
};

/**
 * The function `createSentenceFile` takes a transcript object and a file path as input, extracts the
 * sentences from the transcript, and writes them to a text file at the specified path.
 * @param {PrerecordedTranscriptionResponse} transcript - The `transcript` parameter is an object that
 * represents the transcription response. It contains the results of the transcription, including the
 * paragraphs and sentences.
 * @param {string} pathOut - The `pathOut` parameter is a string that represents the file path where
 * the generated sentence file will be saved.
 */
const createSentenceFile = (
  transcript: PrerecordedTranscriptionResponse,
  pathOut: string
) => {
  const { results } = transcript;
  const { paragraphs } = results.channels[0].alternatives[0].paragraphs;
  const sentences = paragraphs.flatMap((paragraph: Paragraph) =>
    paragraph.sentences.map((sentence) => sentence.text)
  );

  // Write the txt file
  fs.writeFileSync(pathOut, sentences.join("\n"));
};

/**
 * The `createTranscriptionFiles` function takes in a path and a transcription response, and creates
 * various transcription files in the specified directory.
 * @param {string} pathIn - The `pathIn` parameter is a string that represents the input path where the
 * transcription files will be created. It is used to determine the output directory path for the
 * transcription files.
 * @param {PrerecordedTranscriptionResponse} response - The `response` parameter is of type
 * `PrerecordedTranscriptionResponse`. It is an object that contains the transcription data for a
 * prerecorded audio or video file.
 */
export const createTranscriptionFiles = (
  pathIn: string,
  response: PrerecordedTranscriptionResponse
) => {
  const outDir = getOutDirPath(pathIn, "transcription");

  const pathOutVTT = `${outDir}/transcript.vtt`;
  if (response?.toWebVTT) {
    fs.writeFileSync(pathOutVTT, response.toWebVTT());
  } else {
    fs.writeFileSync(pathOutVTT, toWebVTT(response));
  }

  const pathOutJSON = `${outDir}/transcript.json`;
  fs.writeFileSync(pathOutJSON, JSON.stringify(response, null, 2));

  const pathOutTXT = `${outDir}/transcript.txt`;
  createTextFile(response, pathOutTXT);

  const pathOutDovetailVTT = `${outDir}/dovetail.vtt`;
  createDovetailVTT(response, pathOutDovetailVTT);

  const pathOutSentencesTXT = `${outDir}/sentences.txt`;
  createSentenceFile(response, pathOutSentencesTXT);
};
