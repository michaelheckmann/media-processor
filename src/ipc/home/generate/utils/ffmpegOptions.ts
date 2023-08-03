import { windows } from "@/index";

/**
 * The function `onProgress` calculates the progress percentage of a task and sends it to the main
 * window.
 * @param progress - The `progress` parameter is an object that contains the current time mark of the
 * progress. It has a property called `timemark` which is a string representing the current time mark
 * in the format "HH:MM:SS.MS".
 * @param {number} totalTime - The `totalTime` parameter represents the total duration of the video or
 * audio file being processed by the ffmpeg library. It is a number that indicates the total time in
 * seconds.
 */
export const onProgress = (
  progress: { timemark: string },
  totalTime: number
) => {
  const time = parseInt(progress.timemark.replace(/:/g, ""));
  const percent = (time / totalTime) * 100;
  windows.main.webContents.send("progress", percent);
  console.info(`[ffmpeg] progress: ${Math.round(percent)}%`);
};

/**
 * The `onError` function logs an error message and rejects a promise with the error.
 * @param {Error} err - The `err` parameter is of type `Error` and represents the error that occurred.
 * It contains information about the error, such as the error message and stack trace.
 * @param reject - The `reject` parameter is a function that is used to reject a promise. It takes an
 * optional `reason` parameter, which is an error object that represents the reason for the rejection.
 */
export const onError = (err: Error, reject: (reason?: Error) => void) => {
  console.error(`[ffmpeg] error: ${err.message}`);
  reject(err);
};

/**
 * The function `onEnd` sends a message to the `windows.main` to indicate that the progress has finished,
 * logs a message indicating that ffmpeg has finished, and then resolves the promise.
 * @param resolve - The `resolve` parameter is a function that is used to resolve a promise. When
 * called, it indicates that the promise has been fulfilled or resolved successfully.
 */
export const onEnd = (resolve: () => void) => {
  console.log("[ffmpeg] finished");
  windows.main.webContents.send("progress", null);
  resolve();
};
