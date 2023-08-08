import { Dropzone } from "../../../components/Dropzone";
import { FilePreview } from "./FilePreview";
import { ProgressBar } from "./ProgressBar";
import { ProcessingState } from "./Root";
import { TransformationConfig } from "./Sidebar";

type Props = {
  file: File | null;
  config: TransformationConfig;
  handleDrop: (file: File) => void;
  processingState: ProcessingState;
};

export const Main = ({ file, config, handleDrop, processingState }: Props) => {
  return (
    <div className="relative flex flex-col items-center justify-center flex-1 p-4">
      <Dropzone
        {...{ handleDrop }}
        dragInactiveText="Drag 'n' drop a media file here"
        dropZoneProps={{
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
        }}
      >
        <div className="flex items-center justify-center w-full h-full">
          <FilePreview {...{ file, config, processingState }} />
          <ProgressBar />
        </div>
      </Dropzone>
    </div>
  );
};
