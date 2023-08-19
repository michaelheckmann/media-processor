import { useEffect, useState } from "react";

export const Root = () => {
  const [deepgramKey, setDeepgramKey] = useState<string>("");
  const handleDeepgramKeyChange = (value: string) => {
    setDeepgramKey(value);
    window.electronAPI.store.set("deepgramKey", value);
  };

  useEffect(() => {
    const setup = async () => {
      const key = await window.electronAPI.store.get("deepgramKey");
      if (key) {
        setDeepgramKey(key);
      }
    };
    setup();
  }, []);

  return (
    <>
      <div className=" z-10 sticky top-0 left-0 w-full flex items-center text-sm justify-center font-semibold text-stone-300 border-b-1 h-[2.4rem] border-stone-700 tracking-wide bg-stone-900/80 gap-2">
        <div className="flex-1 select-none drag-header">
          <div className="flex items-center justify-center w-full">
            Settings
          </div>
        </div>
      </div>
      <main className="flex flex-col flex-1 p-4">
        <div className="mb-2 font-medium uppercase opacity-30 text-2xs">
          Deepgram API Key
        </div>
        <input
          type="password"
          placeholder="Enter the key"
          value={deepgramKey}
          onChange={({ target }) => handleDeepgramKeyChange(target.value)}
        />
      </main>
    </>
  );
};
