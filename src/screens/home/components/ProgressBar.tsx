import { useEffect, useState } from "react";

export const ProgressBar = () => {
  const [progress, setProgress] = useState<string | undefined>(undefined);
  useEffect(() => {
    window.electronAPI.handleProgress((_, progress: number) => {
      if (progress === undefined) {
        return;
      } else if (progress === null) {
        setProgress(undefined);
        return;
      } else {
        setProgress(Math.round(progress) + "%");
      }
    });
  }, []);

  if (progress === undefined) {
    return null;
  }

  return (
    <div className="absolute flex items-center w-full gap-5 px-4 bottom-3">
      <div className="flex-1 h-3 overflow-hidden rounded-full bg-stone-800">
        <div
          className="h-full duration-200 ease-in-out bg-stone-500 transition-width"
          style={{
            width: progress,
          }}
        ></div>
      </div>
      <div className="font-mono text-sm text-stone-500">{progress}</div>
    </div>
  );
};
