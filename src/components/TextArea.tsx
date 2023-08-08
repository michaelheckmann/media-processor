import { MutableRefObject, useMemo, useRef } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

type TextareaProps = {
  value: MutableRefObject<string>;
  placeholder?: string;
};

export const TextArea = ({ value }: TextareaProps) => {
  const html = useMemo(() => {
    console.log(value);
    return value.current.split("\n").join("<br>");
  }, [value]);
  const lineCount = useMemo(() => html.split("<br>").length, [html]);

  const linesArr = useMemo(
    () => Array.from({ length: lineCount }, (_, i) => i + 1),
    [lineCount]
  );

  // 1. Define refs
  const lineCounterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLDivElement>(null);

  const handleTextareaChange = (event: ContentEditableEvent) => {
    value.current = event.target.value;
  };

  const handleTextAreaScroll = () => {
    if (lineCounterRef.current && textareaRef.current) {
      lineCounterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={lineCounterRef}
        className="absolute top-0 left-0 flex flex-col w-10 h-full px-2 overflow-hidden font-mono text-sm text-right pointer-events-none bg-stone-900 border-r-1 border-stone-700"
      >
        {linesArr.map((count) => (
          <div key={count}>{count}</div>
        ))}
      </div>
      <ContentEditable
        innerRef={textareaRef}
        html={html} // innerHTML of the editable div
        onChange={handleTextareaChange} // handle innerHTML change
        onScroll={handleTextAreaScroll}
        className="flex-1 w-full h-full pl-16 overflow-auto font-mono text-sm bg-transparent rounded outline-none resize-none"
      />
    </div>
  );
};
