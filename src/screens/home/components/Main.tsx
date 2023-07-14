import { Dropzone } from "./Dropzone";
import { FilePreview } from "./FilePreview";
import { ProgressBar } from "./ProgressBar";

type Props = {
  file: File | null;
  handleDrop: (file: File) => void;
};

export const Main = ({ file, handleDrop }: Props) => {
  return (
    <div className="relative flex flex-col items-center justify-center flex-1 p-4">
      <Dropzone {...{ handleDrop }}>
        <div className="flex items-center justify-center w-full h-full">
          <FilePreview {...{ file }} />
          <ProgressBar />
        </div>
      </Dropzone>
    </div>
  );
};
