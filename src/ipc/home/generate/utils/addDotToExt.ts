/**
 * The function adds a dot to the beginning of a file extension if it doesn't already have one.
 * @param {string} [ext] - The `ext` parameter is a string that represents a file extension.
 * @returns The function `addDotToExt` returns the input `ext` with a dot added at the beginning if it
 * doesn't already start with a dot. If `ext` is not provided or is an empty string, the function
 * returns `undefined`.
 */
export const addDotToExt = (ext?: string) => {
  if (!ext) {
    return undefined;
  } else if (ext.startsWith(".")) {
    return ext;
  } else {
    return "." + ext;
  }
};
