import { isMediaFile } from "@/utils/isMediaFile";
import { isTranscriptJSON } from "@/utils/isTranscriptJSON";
import { ComponentProps } from "react";
import { Dropzone } from "../../../components/Dropzone";
import { FilePreview } from "./FilePreview";
import { ProgressBar } from "./ProgressBar";
import { ProcessingState } from "./Root";
import { TransformationConfig } from "./Sidebar";

type DropzoneConfig = Partial<ComponentProps<typeof Dropzone>>;

const exportDropzoneConfig: DropzoneConfig = {
  directory: true,
  dragInactiveText: "Drag 'n' drop the processed media folder",
  selectFile: (files: File[]) => {
    // It should contain a file path that ends in transcript.json
    const transcriptFile = files.find((f) => f.path.endsWith("transcript.txt"));
    // It should contain at least 1 media file (audio or video)
    const mediaFile = files.find((f) => {
      return isMediaFile(f);
    });

    // Every file needs to be in a project folder
    const isInProjectDir = files.every((f) => {
      return f.path.includes("[processed]");
    });

    // It is important that we're returning the .json file, because
    // the .json ending is used to infer that we want to operate on a
    // project folder, not a media file
    return transcriptFile && mediaFile && isInProjectDir
      ? transcriptFile
      : undefined;
  },
  dropZoneProps: {
    noClick: true,
  },
};

const mediaDropzoneConfig: DropzoneConfig = {
  dragInactiveText: "Drag 'n' drop a media file here",
  dropZoneProps: {
    accept: {
      "video/mp4": [".mp4"],
      "video/x-matroska": [".mkv"],
      "video/quicktime": [".mov"],
      "audio/mpeg": [".mp3"],
      "audio/x-wav": [".wav"],
      "audio/x-m4a": [".m4a"],
    },
    multiple: false,
    maxFiles: 1,
    noClick: true,
  },
};

const transcriptionDropzoneConfig: DropzoneConfig = {
  dragInactiveText: "Drag 'n' drop a media file or transcript.json file here",
  dropZoneProps: {
    multiple: false,
    maxFiles: 1,
    noClick: true,
  },
  selectFile: (files: File[]) => {
    if (files.length === 1) {
      if (isMediaFile(files[0]) || isTranscriptJSON(files[0])) {
        return files[0];
      }
      return undefined;
    }
    return undefined;
  },
};

const generalDropzoneConfig: DropzoneConfig = {
  dragInactiveText: "Drag 'n' drop a file here",
  dropZoneProps: {
    noClick: true,
  },
  selectFile: (files: File[]) => {
    if (files.length === 1) {
      if (isMediaFile(files[0]) || isTranscriptJSON(files[0])) {
        return files[0];
      }
      return undefined;
    }

    const transcriptFile = files.find((f) => f.path.endsWith("transcript.txt"));
    const mediaFile = files.find((f) => {
      return isMediaFile(f);
    });
    const isInProjectDir = files.every((f) => {
      return f.path.includes("[processed]");
    });

    return transcriptFile && mediaFile && isInProjectDir
      ? transcriptFile
      : undefined;
  },
};

type Props = {
  file: File | null;
  config: TransformationConfig;
  handleDrop: (file: File) => void;
  processingState: ProcessingState;
};

export const Main = ({ file, config, handleDrop, processingState }: Props) => {
  let dropZoneProps = mediaDropzoneConfig;
  if (config.task === "") {
    dropZoneProps = generalDropzoneConfig;
  } else if (config.task === "export") {
    dropZoneProps = exportDropzoneConfig;
  } else if (config.task === "transcribe") {
    dropZoneProps = transcriptionDropzoneConfig;
  }

  return (
    <div className="relative flex flex-col items-center justify-center flex-1 p-4">
      <Dropzone {...{ handleDrop }} {...dropZoneProps}>
        <div className="flex items-center justify-center w-full h-full">
          <FilePreview {...{ file, config, processingState }} />
          <ProgressBar />
        </div>
      </Dropzone>
    </div>
  );
};
