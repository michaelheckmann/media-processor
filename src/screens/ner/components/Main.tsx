import { Dropzone } from "@/components/Dropzone";
import { LoadingBar } from "@/components/LoadingBar";

type Props = {
  handleScriptDrop: (file: File) => void;
  handleTXTDrop: (file: File) => void;
  txtFile?: File;
  processingState: "idle" | "processing" | "done";
};

export const Main = ({
  handleScriptDrop,
  handleTXTDrop,
  txtFile,
  processingState,
}: Props) => {
  const selectFile = (files: File[]) => {
    console.log(files);

    const mainFile = files.find((f) => f.path.endsWith("ner/main.py"));

    if (mainFile) {
      return mainFile;
    }

    return undefined;
  };

  return (
    <>
      <Dropzone
        handleDrop={handleScriptDrop}
        selectFile={selectFile}
        directory
        dragInactiveText="Drop the ner folder"
        dropZoneProps={{
          noClick: true,
        }}
      >
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="px-8 py-4 font-mono border-green-700 rounded-xl from-stone-900 to-stone-800/70 bg-gradient-to-tr border-1 ring-1 ring-green-500">
            Script loaded
          </div>
        </div>
      </Dropzone>
      <Dropzone
        handleDrop={handleTXTDrop}
        dragInactiveText="Drop a txt file to analyze"
        dropZoneProps={{
          accept: {
            "text/plain": [".txt"],
          },
          multiple: false,
          maxFiles: 1,
          noClick: true,
        }}
      >
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="px-8 py-4 font-mono border-green-700 rounded-xl from-stone-900 to-stone-800/70 bg-gradient-to-tr border-1 ring-1 ring-green-500">
            {txtFile?.name}
          </div>
        </div>
      </Dropzone>
      <div className="w-full h-10">
        {processingState === "processing" && <LoadingBar />}
      </div>
    </>
  );
};
