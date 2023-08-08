import { ReactNode, useState } from "react";
import ReactDropzone, { DropzoneProps } from "react-dropzone";

type Props = {
  handleDrop: (file: File) => void;
  dropZoneProps?: DropzoneProps;
  dragActiveText?: string;
  dragInactiveText?: string;
  children: ReactNode;
};

export const Dropzone = ({
  handleDrop,
  dropZoneProps,
  dragActiveText = "Drop it like it's hot",
  dragInactiveText = "Drag 'n' drop a file here",
  children,
}: Props) => {
  const [fileDropped, setFileDropped] = useState<boolean>(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    } else {
      handleDrop(acceptedFiles[0]);
      setFileDropped(true);
    }
  };

  return (
    <ReactDropzone {...dropZoneProps} {...{ onDrop }}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div
          {...getRootProps()}
          className="flex items-center justify-center w-full h-full"
        >
          <input disabled={fileDropped} {...getInputProps()} />
          {(isDragActive || !fileDropped) && (
            <div className="flex items-center justify-center w-5/6 p-4 font-mono text-center transition-colors duration-200 ease-in-out border-dashed rounded pointer-events-none select-none h-5/6 border-1 border-stone-600 text-stone-500">
              {isDragActive && <span>{dragActiveText}</span>}
              {!isDragActive && <span>{dragInactiveText}</span>}
            </div>
          )}
          {!isDragActive && fileDropped && children}
        </div>
      )}
    </ReactDropzone>
  );
};
