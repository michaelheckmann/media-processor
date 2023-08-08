/**
 * The function generates an ID from a given string by transforming it to lowercase, replacing
 * non-alphanumeric characters with a dash, and removing any leading or trailing dashes.
 * @param {string} str - The `str` parameter is a string that you want to generate an ID from.
 * @returns The function `generateIdFromString` returns a string.
 */
export const generateIdFromString = (str: string) => {
  // Transform to lowercase and replace all non-alphanumeric characters with a dash
  const id = str.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  // Remove any leading or trailing dashes
  return id.replace(/^-+|-+$/g, "").trim();
};
