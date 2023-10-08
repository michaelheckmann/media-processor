import { FfprobeData, ffprobe } from "fluent-ffmpeg";

/**
 * The `ffprobePromise` function is a function that returns a promise which resolves with
 * the data from the `ffprobe` function or rejects with an error.
 * @param {string} pathIn - The `pathIn` parameter is a string that represents the path to the input
 * file for which you want to run the `ffprobe` command.
 * @returns The `ffprobePromise` function is returning a Promise.
 */
export const ffprobePromise = (pathIn: string): Promise<FfprobeData> => {
  return new Promise((resolve, reject) => {
    ffprobe(pathIn, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
