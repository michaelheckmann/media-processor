export const LoadingBar = () => {
  return (
    <div className="absolute flex items-center w-full gap-5 px-4 bottom-3">
      <div className="relative flex-1 w-full h-3 rounded-full from-stone-800 to-stone-700 bg-gradient-to-tr">
        <span className="loading-stripes"></span>
      </div>
    </div>
  );
};
