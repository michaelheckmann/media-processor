type Props = {
  file: File | null;
};

export const FilePreview = ({ file }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-40 h-40">
        <div className="absolute top-0 left-0 z-10 w-40 h-40 overflow-hidden rounded-2xl">
          <div className="absolute -top-1/2 -left-1/2 w-96 h-96 mesh-gradient spin-slow"></div>
          <div className="absolute top-1 left-1 flex items-center justify-center font-bold w-[9.5rem] h-[9.5rem] rounded-[0.75rem] bg-stone-900/95">
            <div>{file?.type}</div>
          </div>
        </div>
        <div className="absolute top-0 left-0 z-0 w-40 h-40 mesh-gradient spin-slow blur-2xl opacity-40"></div>
      </div>
      <div className="text-center opacity-90">{file?.name}</div>
    </div>
  );
};
