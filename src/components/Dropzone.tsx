import clsx from "clsx";
import { DragEvent, ReactNode, useState } from "react";
import ReactDropzone, { DropzoneProps } from "react-dropzone";
import Balancer from "react-wrap-balancer";

type Props = {
  handleDrop: (file: File) => void;
  dropZoneProps?: DropzoneProps;
  dragActiveText?: string;
  dragInactiveText?: string;
  selectFile?: (files: File[]) => File | undefined;
  directory?: boolean;
  children: ReactNode;
};

export const Dropzone = ({
  handleDrop,
  dropZoneProps,
  dragActiveText = "Drop it like it's hot",
  dragInactiveText = "Drag 'n' drop a file here",
  selectFile = (files: File[]) => (files.length ? files[0] : undefined),
  directory = false,
  children,
}: Props) => {
  const [fileDropped, setFileDropped] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);

  const onDrop = (acceptedFiles: File[]) => {
    setIsValid(undefined);
    const selectedFile = selectFile(acceptedFiles);

    if (selectedFile) {
      handleDrop(selectedFile);
      setFileDropped(true);
    } else {
      return;
    }
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    const types = Array.from(e.dataTransfer.items).map((i) => i.type);
    const isDirectory = types[0] === "";

    if (types.length === 0) {
      setIsValid(false);
      return;
    }

    if (directory && isDirectory) {
      setIsValid(true);
      return;
    }

    if (directory && !isDirectory) {
      setIsValid(false);
      return;
    }

    if (dropZoneProps?.accept === undefined) {
      setIsValid(true);
      return;
    }

    setIsValid(
      types.every((type) => dropZoneProps?.accept?.[type] !== undefined)
    );
  };

  const onDragLeave = () => {
    setIsValid(undefined);
  };

  return (
    <ReactDropzone {...dropZoneProps} {...{ onDrop, onDragEnter, onDragLeave }}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div
          {...getRootProps()}
          className="flex items-center justify-center w-full h-full"
        >
          <input disabled={fileDropped} {...getInputProps()} />
          {(isDragActive || !fileDropped) && (
            <div
              className={clsx(
                "flex items-center justify-center w-5/6 p-4 font-mono text-center transition-colors duration-200 ease-in-out border-dashed rounded pointer-events-none select-none h-5/6 border-1 ",
                {
                  "border-green-600 text-green-500": isValid === true,
                  "border-red-600 text-red-500": isValid === false,
                  "border-stone-600 text-stone-500": isValid === undefined,
                }
              )}
            >
              {isDragActive && (
                <Balancer>
                  {isValid ? dragActiveText : "Invalid filetype"}
                </Balancer>
              )}
              {!isDragActive && <Balancer>{dragInactiveText}</Balancer>}
            </div>
          )}
          {!isDragActive && fileDropped && children}
        </div>
      )}
    </ReactDropzone>
  );
};
