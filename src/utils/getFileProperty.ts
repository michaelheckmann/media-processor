type StringProperties<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

/**
 * The getFileProperty function returns a specified property of a File object or a string.
 * @param {File | string} file - The `file` parameter can be either a `File` object or a string
 * representing the file path.
 * @param [property=path] - The `property` parameter is a string that represents the property of the
 * `File` object that you want to retrieve. It has a default value of "path", which means that if you
 * don't provide a value for `property`, the function will return the `path` property of the `File
 * @returns the value of the specified property of the file. If the file is a string, it will return
 * the file itself. If the file is an object (File), it will return the value of the specified
 * property. If the file is null or undefined, it will return an empty string.
 */
export const getFileProperty = (
  file: File | string,
  property: StringProperties<File> = "path"
) => {
  if (!file) return "";
  return typeof file === "string" ? file : file[property];
};
