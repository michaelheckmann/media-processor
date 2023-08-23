import { TransformationConfig } from "@/screens/home/components/Sidebar";
import { inputToSpeakerMap } from "@/screens/home/utils/transformSpeakerMap";
import { isMediaFile } from "@/utils/isMediaFile";
import { transformTimestamp } from "@/utils/transformTimestamp";
import { spawnSync } from "child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "fs";

const exportToNotion = (dirIn: string, speakerMapString: string) => {
  const speakerMap = inputToSpeakerMap(speakerMapString);
  const transcript = readFileSync(
    dirIn + "/transcription/transcript.txt",
    "utf8"
  );
  const lines = transcript.split("\n");
  const markdown = lines.map((line) => {
    if (line.includes(" --> ")) {
      const [start] = line.split(" --> ");
      return `**${transformTimestamp(start)}**`;
    } else if (line.startsWith("Speaker ")) {
      const name = speakerMap[line.split(" ")[1]];
      return `\`${name ?? line}\``;
    } else {
      return line;
    }
  });

  writeFileSync(`${dirIn}/export/notion-transcript.md`, markdown.join("\n"));
};

export const exportTransformation = async (
  pathIn: string,
  config: TransformationConfig
) => {
  const pathParts = pathIn.split("/");
  const projectPartIndex = pathParts.findIndex((part) =>
    part.endsWith("[processed]")
  );
  const projectDirPath = pathParts.slice(0, projectPartIndex + 1).join("/");
  const outDirPath = `${projectDirPath}/export`;

  if (!existsSync(outDirPath)) {
    mkdirSync(outDirPath);
  }

  //   Get all files in the project folder and sort by last modified
  const files = readdirSync(projectDirPath)
    .map((name) => {
      const nameWithoutExtension = name.split(".").slice(0, -1).join(".");
      return {
        name: nameWithoutExtension,
        path: name,
        time: statSync(`${projectDirPath}/${name}`).mtime.getTime(),
      };
    })
    .sort((a, b) => b.time - a.time);

  const lastModifiedMediaFile = files.find((file) => isMediaFile(file.path));

  if (config.exportOption === "notion") {
    exportToNotion(projectDirPath, config.speakerMap);
    copyFileSync(
      `${projectDirPath}/${lastModifiedMediaFile.path}`,
      `${outDirPath}/${lastModifiedMediaFile.path}`
    );
  }

  if (config.exportOption === "s3") {
    const s3ExportDirPath = `${outDirPath}/${lastModifiedMediaFile.name.replace(
      /\s\[.*?\]/g,
      ""
    )}`;
    if (!existsSync(s3ExportDirPath)) {
      mkdirSync(s3ExportDirPath);
    }

    copyFileSync(
      `${projectDirPath}/${lastModifiedMediaFile.path}`,
      `${s3ExportDirPath}/${lastModifiedMediaFile.path}`
    );

    // Check if the right transcription file exists
    let transcriptionFile = "dovetail [redacted].vtt";
    if (!existsSync(`${projectDirPath}/transcription/${transcriptionFile}`)) {
      transcriptionFile = "dovetail.vtt";

      if (!existsSync(`${projectDirPath}/transcription/${transcriptionFile}`)) {
        throw new Error("No transcription file found");
      }
    }

    copyFileSync(
      `${projectDirPath}/transcription/${transcriptionFile}`,
      `${s3ExportDirPath}/${transcriptionFile}`
    );
  }
  spawnSync("open", [outDirPath]);
};
