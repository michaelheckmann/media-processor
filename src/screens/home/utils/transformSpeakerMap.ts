export const inputToSpeakerMap = (input: string): Record<string, string> => {
  const speakerAssignments = input.split(",").map((a) => a.trim());
  const speakerMap: Record<string, string> = {};
  speakerAssignments.forEach((assignment) => {
    if (!assignment.includes(":")) return;
    const [speaker, name] = assignment.split(":");
    speakerMap[speaker] = name;
  });
  return speakerMap;
};

export const speakerMapToInput = (
  speakerMap: Record<string, string>
): string => {
  return Object.keys(speakerMap)
    .map((speaker) => `${speaker}: ${speakerMap[speaker]}`)
    .join(", ");
};

export const isValidSpeakerMap = (input: string) => {
  const speakerAssignments = input.split(",").map((a) => a.trim());
  return speakerAssignments.every((assignment) => {
    if (!assignment.includes(":")) return false;
    const [speaker, name] = assignment.split(":");
    return parseInt(speaker) >= 0 && name.length > 0;
  });
};
