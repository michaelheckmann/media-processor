import { isProjectFile } from "@/utils/isProjectFile";
import { LoadingBar } from "../../../components/LoadingBar";
import { ProcessingState } from "./Root";
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

type Props = {
  file: File | null;
  config: TransformationConfig;
  processingState: ProcessingState;
};

export const FilePreview = ({ file, config, processingState }: Props) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative w-40 h-40">
          <div className="absolute top-0 left-0 z-10 w-40 h-40 overflow-hidden rounded-2xl">
            <div className="absolute -top-1/2 -left-1/2 w-96 h-96 mesh-gradient spin-slow"></div>
            <div className="absolute top-1 left-1 flex items-center justify-center font-bold w-[9.5rem] h-[9.5rem] rounded-[0.75rem] bg-stone-900/95">
              <div>{isProjectFile(file) ? "project" : file.type}</div>
            </div>
          </div>
          <div className="absolute top-0 left-0 z-0 w-40 h-40 mesh-gradient spin-slow blur-2xl opacity-40"></div>
        </div>
        <div className="text-center opacity-90">
          {isProjectFile(file) ? getProjectName(file.path) : file.name}
        </div>
      </div>
      {(config.task === "transcribe" || config.task === "export") &&
        processingState === "processing" && <LoadingBar />}
    </>
  );
};
