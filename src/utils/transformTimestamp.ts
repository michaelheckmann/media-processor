export const transformTimestamp = (timestamp: string) => {
  const parts = timestamp.split(":");
  let hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = Math.round(parseFloat(parts[2]));

  if (seconds >= 60) {
    hours += Math.floor(seconds / 3600);
  }

  hours = hours % 24; // Optional: If you want to handle hours greater than 24

  const hourPart = hours === 0 ? "" : hours.toString().padStart(2, "0");
  const minutePart = minutes.toString().padStart(2, "0");
  const secondPart = seconds.toString().padStart(2, "0");

  if (hours === 0) {
    return `${minutePart}:${secondPart}`;
  }

  return `${hourPart}:${minutePart}:${secondPart}`;
};
