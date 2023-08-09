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
  const projectFolderPath = pathParts.slice(0, projectPartIndex + 1).join("/");
  const outFolderPath = `${projectFolderPath}/export`;

  if (!existsSync(outFolderPath)) {
    mkdirSync(outFolderPath);
  }

  //   Get all files in the project folder and sort by last modified
  const files = readdirSync(projectFolderPath)
    .map((name) => ({
      name,
      time: statSync(`${projectFolderPath}/${name}`).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time);

  const lastModifiedMediaFile = files.find((file) => isMediaFile(file.name));

  if (config.exportOption === "notion") {
    exportToNotion(projectFolderPath, config.speakerMap);
    copyFileSync(
      `${projectFolderPath}/${lastModifiedMediaFile.name}`,
      `${projectFolderPath}/export/${lastModifiedMediaFile.name}`
    );
  }
  spawnSync("open", [outFolderPath]);
};
