import { getFileProperty } from "./getFileProperty";

const mimeTypes = {
  video: [
    "3gp",
    "3gpp",
    "3g2",
    "h261",
    "h263",
    "h264",
    "m4s",
    "jpgv",
    "jpm",
    "jpgm",
    "mj2",
    "mjp2",
    "ts",
    "mp4",
    "mp4v",
    "mpg4",
    "mpeg",
    "mpg",
    "mpe",
    "m1v",
    "m2v",
    "ogv",
    "qt",
    "mov",
    "uvh",
    "uvvh",
    "uvm",
    "uvvm",
    "uvp",
    "uvvp",
    "uvs",
    "uvvs",
    "uvv",
    "uvvv",
    "dvb",
    "fvt",
    "mxu",
    "m4u",
    "pyv",
    "uvu",
    "uvvu",
    "viv",
    "webm",
    "f4v",
    "fli",
    "flv",
    "m4v",
    "mkv",
    "mk3d",
    "mks",
    "mng",
    "asf",
    "asx",
    "vob",
    "wm",
    "wmv",
    "wmx",
    "wvx",
    "avi",
    "movie",
    "smv",
  ],
  audio: [
    "3gpp",
    "adp",
    "amr",
    "au",
    "snd",
    "mid",
    "midi",
    "kar",
    "rmi",
    "mxmf",
    "mp3",
    "m4a",
    "mp4a",
    "mpga",
    "mp2",
    "mp2a",
    "m2a",
    "m3a",
    "oga",
    "ogg",
    "spx",
    "opus",
    "s3m",
    "sil",
    "uva",
    "uvva",
    "eol",
    "dra",
    "dts",
    "dtshd",
    "lvp",
    "pya",
    "ecelp4800",
    "ecelp7470",
    "ecelp9600",
    "rip",
    "wav",
    "weba",
    "aac",
    "aif",
    "aiff",
    "aifc",
    "caf",
    "flac",
    "mka",
    "m3u",
    "wax",
    "wma",
    "ram",
    "ra",
    "rmp",
    "xm",
  ],
};

export const isMediaFile = (file?: File | string): boolean => {
  const fileName = getFileProperty(file, "name");
  if (!fileName) {
    return false;
  }
  const extension = fileName.split(".").pop();
  if (!extension) return false;
  const mimeType = Object.keys(mimeTypes).find((type) =>
    mimeTypes[type as keyof typeof mimeTypes].includes(extension)
  );
  return !!mimeType;
};

export const isAudioFile = (file?: File | string): boolean => {
  const fileName = getFileProperty(file, "name");
  if (!fileName) {
    return false;
  }
  const extension = fileName.split(".").pop();
  if (!extension) return false;
  return mimeTypes.audio.includes(extension);
};

export const isVideoFile = (file?: File | string): boolean => {
  const fileName = getFileProperty(file, "name");
  if (!fileName) {
    return false;
  }
  const extension = fileName.split(".").pop();
  if (!extension) return false;
  return mimeTypes.video.includes(extension);
};
