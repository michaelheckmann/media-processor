import { getFileProperty } from "./getFileProperty";

/**
 * The function `isProjectFile` checks if a given file path ends with "transcript.txt".
 * @param {File} file - The `file` parameter is of type `File`, which represents a file object.
 * @returns a boolean value indicating whether the file path ends with "transcript.txt".
 */
export const isProjectFile = (file?: File | string) => {
  const filePath = getFileProperty(file, "path");
  if (!filePath) {
    return false;
  }
  return filePath.endsWith("transcript.txt");
};
