import { BrowserWindow } from "electron";
import { bins, paths } from "ffmpeg-static-electron-forge";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { GenerationConfig } from "../screens/home/components/Sidebar";

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
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

export function reduceFile(
  pathIn: string,
  pathOut: string,
  config: GenerationConfig,
  mainWindow: BrowserWindow
) {
  let totalTime = 0;
  let compression = 8;
  if (config.compression === "low") {
    compression = 4;
  } else if (config.compression === "high") {
    compression = 16;
  }

  return new Promise<void>((resolve, reject) => {
    ffmpeg(pathIn)
      .videoFilter(
        `scale=trunc(iw/${compression})*2:trunc(ih/${compression})*2`
      )
      .outputOptions(["-vcodec libx264", "-preset ultrafast"])
      .on("codecData", (data) => {
        totalTime = parseInt(data.duration.replace(/:/g, ""));
      })
      .on("progress", (progress) => {
        const time = parseInt(progress.timemark.replace(/:/g, ""));
        const percent = (time / totalTime) * 100;
        mainWindow.webContents.send("progress", percent);
        console.info(`[ffmpeg] progress: ${Math.round(percent)}%`);
      })
      .on("error", (err) => {
        console.error(`[ffmpeg] error: ${err.message}`);
        reject(err);
      })
      .on("end", () => {
        mainWindow.webContents.send("progress", null);
        console.log("[ffmpeg] finished");
        resolve();
      })
      .save(pathOut);
  });
}

export function transcribeFile() {
  console.log("Transcribe");
}
