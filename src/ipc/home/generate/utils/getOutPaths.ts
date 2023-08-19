import fs from "fs";
import path from "path";
import { getPseudonym } from "./getPseudonym";

/**
 * The function `getStrippedFileName` takes a file path as input and returns the file name without the
 * extension and any square bracketed text, with leading and trailing whitespace removed.
 * @param {string} filePath - A string representing the file path of a file.
 * @returns The function `getStrippedFileName` returns the stripped file name from the given file path.
 */
const getStrippedFileName = (filePath: string) => {
  const fileName = path.basename(filePath);
  const fileExtension = path.extname(filePath);
  return fileName.replace(fileExtension, "").trim();
};

/**
 * The `anonymizeFileName` function takes a file path and an optional anonymization string, and returns
 * a new file path with the anonymization string replaced by a pseudonym.
 * @param {string} filePath - A string representing the file path of the file that needs to be
 * anonymized.
 * @param {string} [anonymization] - The `anonymization` parameter is a string that represents the part
 * of the file name that needs to be anonymized.
 * @returns The function `anonymizeFileName` returns the `filePath` with the `anonymization` replaced
 * by its corresponding `pseudonym`. If no `anonymization` is provided, it returns the original
 * `filePath`.
 */
const anonymizeFileName = (filePath: string, anonymization?: string) => {
  if (!anonymization) return filePath;
  const pseudonym = getPseudonym(anonymization);
  return filePath.replace(anonymization, pseudonym);
};

/**
 * Returns the output directory path for the given file path and subfolder.
 * If the file directory already contains the outDirectoryMarker, the output directory is the file directory itself or a subfolder if specified.
 * Otherwise, the output directory is a new directory with the outDirectoryMarker in the file directory or a subfolder if specified.
 * @param filePath The path of the file.
 * @param subFolder The subfolder to create inside the output directory.
 * @returns The output directory path.
 */
export const getOutDirPath = (filePath: string, subFolder?: string) => {
  const fileDirectory = path.dirname(filePath);
  const fileName = getStrippedFileName(filePath);

  const outDirectoryMarker = " [processed]";

  // Check if the file directory already contains the outDirectoryMarker
  const hasOutDirectoryMarker = fileDirectory.includes(outDirectoryMarker);

  // Create the output directory path
  const outputDirectory = hasOutDirectoryMarker
    ? fileDirectory
    : fileDirectory + "/" + fileName + outDirectoryMarker;

  // Create the subfolder path if specified
  const subFolderDirectory = subFolder
    ? outputDirectory + "/" + subFolder
    : outputDirectory;

  // Create the output directory and subfolder if they don't exist
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
  }
  if (subFolder && !fs.existsSync(subFolderDirectory)) {
    fs.mkdirSync(subFolderDirectory);
  }

  return subFolderDirectory;
};

/**
 * The function `getOutFilePath` takes a file path and an extension, and returns a new file path with
 * the extension appended to the file name.
 * @param {string} filePath - The `filePath` parameter is a string that represents the path of the file
 * for which you want to generate a new output file path.
 * @param {string} extension - The `extension` parameter is a string that represents the desired
 * extension for the output file.
 * @returns the output file path, which is a combination of the output directory path and the new file
 * name.
 */
export const getOutFilePath = (
  filePath: string,
  extension: string,
  anonymization?: string
) => {
  const ourDirectory = getOutDirPath(filePath);

  const fileName = getStrippedFileName(filePath);
  const fileExtension = path.extname(filePath);
  const newFileName =
    anonymizeFileName(fileName, anonymization) +
    ` [${extension}]` +
    fileExtension;

  return ourDirectory + "/" + newFileName;
};
