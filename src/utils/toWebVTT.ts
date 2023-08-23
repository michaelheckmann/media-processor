import { secondToTimestamp } from "@/ipc/home/generate/utils/secondToTimestamp";
import {
  PrerecordedTranscriptionResponse,
  Utterance,
  WordBase,
} from "@deepgram/sdk/dist/types";

/**
 * The `toWebVTT` function converts a PrerecordedTranscriptionResponse object into a WebVTT formatted
 * string. Taken from here: https://github.com/deepgram/deepgram-node-sdk/blob/74a4e567782c075aa8ecfbed5a8e99b4af5a8b82/src/types/prerecordedTranscriptionResponse.ts#L26
 * @param {PrerecordedTranscriptionResponse} response - The `response` parameter is an object that
 * contains the transcription response from Deepgram. It should have the following structure:
 * @param [lineLength=8] - The `lineLength` parameter is the number of words that should be included in
 * each line of the WebVTT file. It determines how long each caption line will be. By default, it is
 * set to 8 words per line.
 * @returns The function `toWebVTT` returns a string that represents the transcription in WebVTT
 * format.
 */
export const toWebVTT = (
  response: PrerecordedTranscriptionResponse,
  lineLength = 8
): string => {
  const lines: string[] = [];
  lines.push("WEBVTT");
  lines.push("");
  lines.push("NOTE");
  lines.push("Transcription provided by Deepgram");
  lines.push(`Request Id: ${response.metadata?.request_id}`);
  lines.push(`Created: ${response.metadata?.created}`);
  lines.push(`Duration: ${response.metadata?.duration}`);
  lines.push(`Channels: ${response.metadata?.channels}`);
  lines.push("");

  const chunk = (arr: unknown[], length: number) => {
    const res: unknown[] = [];

    for (let i = 0; i < arr.length; i += length) {
      const chunkarr = arr.slice(i, i + length);
      res.push(chunkarr);
    }

    return res;
  };

  const limitedUtterance = (utterance: Utterance, length: number): string => {
    const wordChunks = chunk(utterance.words, length);
    const limitedLines: string[] = [];

    wordChunks.forEach((words: WordBase[]) => {
      const firstWord = words[0];
      const lastWord = words[words.length - 1];

      limitedLines.push(
        `${secondToTimestamp(firstWord.start)} --> ${secondToTimestamp(
          lastWord.end
        )}`
      );
      limitedLines.push(
        words.map((word) => word.punctuated_word ?? word.word).join(" ")
      );
      limitedLines.push("");
    });

    return limitedLines.join("\n");
  };

  response.results.utterances.forEach((utterance) => {
    lines.push(limitedUtterance(utterance, lineLength));
  });

  return lines.join("\n");
};
