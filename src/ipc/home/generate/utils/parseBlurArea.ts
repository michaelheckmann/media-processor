import { FfprobeData } from "fluent-ffmpeg";

export const parseBlurArea = (
  blurAreaString: string,
  { streams }: FfprobeData
) => {
  const blurArea = blurAreaString.split(":");
  const videoStream = streams.find((s) => s.codec_type === "video");
  const { width, height } = videoStream;

  return blurArea.map((v, i) => {
    if (v.includes("%")) {
      if (i === 0 || i === 2) {
        // width or x
        return Math.round((parseFloat(v) / 100) * width);
      } else {
        // height or y
        return Math.round((parseFloat(v) / 100) * height);
      }
    }
    return v;
  });
};
