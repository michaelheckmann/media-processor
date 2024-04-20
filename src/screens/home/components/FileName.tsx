import { getPseudonym } from "@/ipc/home/generate/utils/getPseudonym";
import { isProjectFile } from "@/utils/isProjectFile";
import clsx from "clsx";
import { Tooltip } from "react-tooltip";
import { TransformationConfig } from "./Sidebar";

const getProjectName = (path: string) => {
  const parts = path.split("/");
  const projectDirectory = parts.find((p) => p.endsWith("[processed]"));
  if (!projectDirectory) {
    return "Media Project";
  } else {
    return projectDirectory.replace("[processed]", "").trim();
  }
};

const getDisplayName = (file: File, config: TransformationConfig) => {
  const name = isProjectFile(file) ? getProjectName(file.path) : file.name;
  if (config.anonymizeFileName) {
    const pseudonym = getPseudonym(config.anonymizeFileName);
    console.log("getDisplayName ~ pseudonym:", pseudonym);

    return name.replace(config.anonymizeFileName, pseudonym);
  } else {
    return name;
  }
};

type Props = {
  file: File | null;
  config: TransformationConfig;
};

export const FileName = ({ file, config }: Props) => {
  const isAnonymized = !!config.anonymizeFileName;
  return (
    <>
      <div
        className={clsx("text-center opacity-90", {
          "border-dashed border-b-1 border-stone-400": isAnonymized,
        })}
        id="file-name"
      >
        {isProjectFile(file) ? getProjectName(file.path) : file.name}
      </div>
      <Tooltip
        hidden={!isAnonymized}
        anchorSelect="#file-name"
        place="top"
        noArrow
        offset={4}
        className="max-w-md font-mono text-center shadow border-1 border-stone-800"
        opacity={1}
        style={{
          fontSize: "0.65rem",
          lineHeight: "1rem",
          background: "black",
          borderRadius: "0.5rem",
          padding: "0.25rem 0.5rem",
          zIndex: 9999,
        }}
      >
        {getDisplayName(file, config)}
      </Tooltip>
    </>
  );
};
