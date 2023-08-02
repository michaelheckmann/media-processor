/**
 * The `secondToTimestamp` function converts a number of seconds into a timestamp format of hours,
 * minutes, seconds, and milliseconds.
 * @param {number} seconds - The `seconds` parameter is a number representing the total number of
 * seconds.
 * @returns a formatted timestamp string in the format "HH:MM:SS.MMM" where HH represents hours, MM
 * represents minutes, SS represents seconds, and MMM represents milliseconds.
 */
export const secondToTimestamp = (seconds: number) => {
  const padZero = (num: number | string, size: number, start = true) => {
    let padded = num.toString();
    while (padded.length < size) {
      padded = (start ? "0" : "") + padded + (start ? "" : "0");
    }
    return padded;
  };

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const parsedMiliSeconds = seconds.toString().split(".");

  let remainingMiliSeconds = "000";
  if (parsedMiliSeconds.length > 1) {
    remainingMiliSeconds = parsedMiliSeconds[1].slice(0, 3);
  }

  const formattedHours = padZero(hours, 2);
  const formattedMinutes = padZero(minutes, 2);
  const formattedSeconds = padZero(Math.floor(remainingSeconds), 2);
  const formattedMilliseconds = padZero(remainingMiliSeconds, 3, false);

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
};
