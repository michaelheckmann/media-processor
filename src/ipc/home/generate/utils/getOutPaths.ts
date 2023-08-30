import fs from "fs";
import path from "path";
import { addDotToExt } from "./addDotToExt";
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
 * The `getOutFilePath` function takes a file path, an extension, and optional options, and returns a
 * new file path with an anonymized file name, the specified extension, and the original file
 * extension.
 * @param {string} filePath - The `filePath` parameter is a string that represents the path of the
 * input file.
 * @param {string} extension - The `extension` parameter is a string that represents the desired
 * extension for the output file.
 * @param options - The `options` parameter is an optional object that can have two properties:
 * `anonymization` and `fileExtension`. The `anonymization` property is a string that represents the
 * part of the file name that needs to be anonymized. The `fileExtension` property is a string that
 * represents the file extension of the input file. If the `fileExtension` property is not provided,
 * the function will use the file extension of the input file.
 * @returns a string representing the output file path.
 */
export const getOutFilePath = (
  filePath: string,
  extension: string,
  options: {
    anonymization?: string;
    fileExtension?: string;
  } = {}
) => {
  const ourDirectory = getOutDirPath(filePath);

  const fileName = getStrippedFileName(filePath);
  const fileExtension =
    addDotToExt(options.fileExtension) ?? path.extname(filePath);
  const newFileName =
    anonymizeFileName(fileName, options.anonymization) +
    ` [${extension}]` +
    fileExtension;

  return ourDirectory + "/" + newFileName;
};
