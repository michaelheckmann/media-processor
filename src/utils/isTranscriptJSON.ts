import { getFileProperty } from "./getFileProperty";

/**
 * The function `isTranscriptJSON` checks if a given file is a transcript JSON file.
 * @param {File | string} file - The `file` parameter can be either a `File` object or a string.
 * @returns The function isTranscriptJSON returns a boolean value.
 */
export const isTranscriptJSON = (file?: File | string) => {
  const filePath = getFileProperty(file, "path");
  if (!filePath) {
    return false;
  }
  return filePath.endsWith("transcript.json");
};
