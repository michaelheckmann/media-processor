import { Dropzone } from "./Dropzone";
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
      <Dropzone {...{ handleDrop }}>
        <div className="flex items-center justify-center w-full h-full">
          <FilePreview {...{ file, config, processingState }} />
          <ProgressBar />
        </div>
      </Dropzone>
    </div>
  );
};
