import { bins, paths } from "ffmpeg-static-electron-forge";
import { setFfmpegPath, setFfprobePath } from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

//require the ffmpeg package so we can use ffmpeg using JS
//Get the paths to the packaged versions of the binaries we want to use

let ffmpegPath: string, ffprobePath: string;

if (process.env.NODE_ENV !== "development") {
  ffmpegPath = paths.ffmpegPath.replace("app.asar", "app.asar.unpacked");
  ffprobePath = paths.ffprobePath.replace("app.asar", "app.asar.unpacked");
} else {
  let ffmpegBinPaths = path.dirname(
    require.resolve("ffmpeg-static-electron-forge")
  );
  ffmpegBinPaths = path.resolve(process.cwd(), ffmpegBinPaths, "bin");
  ffmpegPath = path.join(ffmpegBinPaths, bins.ffmpegPath);
  ffprobePath = path.join(ffmpegBinPaths, bins.ffprobePath);
}

fs.chmodSync(ffmpegPath, 0o755);
fs.chmodSync(ffprobePath, 0o755);

//tell the ffmpeg package where it can find the needed binaries.
setFfmpegPath(ffmpegPath);
setFfprobePath(ffprobePath);
