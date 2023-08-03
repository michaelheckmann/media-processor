export const generateIdFromString = (str: string) => {
  // Transform to lowercase and replace all non-alphanumeric characters with a dash
  const id = str.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  // Remove any leading or trailing dashes
  return id.replace(/^-+|-+$/g, "").trim();
};
