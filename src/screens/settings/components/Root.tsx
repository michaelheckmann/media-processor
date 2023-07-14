import { useEffect, useState } from "react";

export const Root = () => {
  const [deepgramKey, setDeepgramKey] = useState<string>("");
  const handleDeepgramKeyChange = (value: string) => {
    setDeepgramKey(value);
    window.electronAPI.store.set("deepgramKey", value);
  };

  useEffect(() => {
    const key = window.electronAPI.store.get("deepgramKey");
    if (key) {
      setDeepgramKey(key);
    }
  }, []);

  return (
    <>
      <div className="w-full flex items-center text-sm justify-center font-semibold text-stone-300 border-b-1 h-[2.4rem] border-stone-700 tracking-wide bg-stone-900/80 gap-2 drag-header">
        Settings
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
