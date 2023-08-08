import { generateIdFromString } from "@/utils/generateIdFromString";
import { clsx } from "clsx";
import { ReactNode } from "react";
import { Tooltip } from "react-tooltip";

export type InputWrapperProps = {
  label: string;
  link?: string;
  optional?: boolean;
  tooltip?: string;
  children?: ReactNode;
};

export const InputWrapper = ({
  label,
  link,
  tooltip,
  optional,
  children,
}: InputWrapperProps) => {
  const id = generateIdFromString(label);
  const onClick = () => {
    if (link) {
      if (!link.startsWith("http")) {
        link = "https://" + link;
      }
      window.electronAPI.openLink(link);
    }
  };
  return (
    <>
      <div className="flex flex-col items-start gap-1">
        <div
          className={clsx(
            "flex items-center gap-1 font-medium uppercase transition-opacity select-none opacity-30 text-2xs",
            {
              "hover:opacity-50": link,
              "mb-[2px]": tooltip,
            }
          )}
          {...{ onClick }}
        >
          <span {...{ id }}>
            <span
              className={clsx({
                "border-dashed border-b-1 border-stone-400": tooltip,
              })}
            >
              {label}
            </span>
            {optional && <span className="ml-1 opacity-50">opt</span>}
          </span>
          {link && (
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3.5"
                stroke="currentColor"
                className="relative w-[10px] h-[10px] top-[0.5px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </span>
          )}
        </div>
        {children}
      </div>
      <Tooltip
        anchorSelect={`#${id}`}
        place="top"
        noArrow
        offset={4}
        className="max-w-md font-mono shadow border-1 border-stone-800"
        opacity={1}
        style={{
          fontSize: "0.65rem",
          lineHeight: "1rem",
          background: "black",
          borderRadius: "0.5rem",
          padding: "0.25rem 0.5rem",
          zIndex: 9999,
        }}
      >
        {tooltip}
      </Tooltip>
    </>
  );
};
