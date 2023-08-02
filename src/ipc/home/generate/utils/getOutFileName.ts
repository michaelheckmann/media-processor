import fs from "fs";
import path from "path";

/**
 * The function `getOutFileName` takes a file path and an extension, creates a new directory with the
 * name of the file if it doesn't exist, and returns the new file path with the extension appended.
 * @param {string} filePath - The `filePath` parameter is a string that represents the path to a file,
 * including the file name and extension. For example, it could be something like "/path/to/file.txt".
 * @param {string} extension - The `extension` parameter is a string that represents the desired file
 * extension for the output file.
 * @returns a string that represents the path of the output file.
 */
export const getOutFileName = (filePath: string, extension: string) => {
  const fileDirectory = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const fileExtension = path.extname(filePath);
  const strippedFileName = fileName
    .replace(fileExtension, "")
    .replace(/\s*\[.*?\]\s*/g, "")
    .trim();
  const delimitedExtension = ` [${extension}]`;

  // Create a new directory in the file's directory with the name of the file, if it doesn't exist yet
  const newDirectory = path.join(fileDirectory, strippedFileName);
  if (!fs.existsSync(newDirectory)) {
    fs.mkdirSync(newDirectory);
  }

  return path.join(
    newDirectory,
    strippedFileName + delimitedExtension + fileExtension
  );
};
