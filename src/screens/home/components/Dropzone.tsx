import { ReactNode, useState } from "react";
import ReactDropzone from "react-dropzone";
import { setDefaultGradient } from "../utils/gradients";

type Props = {
  handleDrop: (file: File) => void;
  children: ReactNode;
};

export const Dropzone = ({ handleDrop, children }: Props) => {
  const [fileDropped, setFileDropped] = useState<boolean>(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    } else {
      handleDrop(acceptedFiles[0]);
      setFileDropped(true);
      setDefaultGradient();
    }
  };

  return (
    <ReactDropzone
      accept={{
        "video/mp4": [".mp4"],
        "video/x-matroska": [".mkv"],
        "video/quicktime": [".mov"],
        "audio/mpeg": [".mp3"],
        "audio/x-wav": [".wav"],
        "audio/x-m4a": [".m4a"],
      }}
      multiple={false}
      maxFiles={1}
      noClick={true}
      {...{ onDrop }}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div
          {...getRootProps()}
          className="flex items-center justify-center w-full h-full"
        >
          <input disabled={fileDropped} {...getInputProps()} />
          {(isDragActive || !fileDropped) && (
            <div className="flex items-center justify-center w-5/6 p-4 transition-colors duration-200 ease-in-out border-dashed rounded pointer-events-none select-none h-5/6 border-1 border-stone-600 text-stone-600">
              {isDragActive && <span>Drop it like it's hot</span>}
              {!isDragActive && <span>Drag 'n' drop a file here</span>}
            </div>
          )}
          <div>{!isDragActive && fileDropped && children}</div>
        </div>
      )}
    </ReactDropzone>
  );
};
