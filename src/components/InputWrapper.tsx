import clsx from "clsx";
import { ReactNode } from "react";

export type InputWrapperProps = {
  label: string;
  link?: string;
  optional?: boolean;
  children?: ReactNode;
};

export const InputWrapper = ({ label, link, children }: InputWrapperProps) => {
  const onClick = () => {
    if (link) {
      if (!link.startsWith("http")) {
        link = "https://" + link;
      }
      window.electronAPI.openLink(link);
    }
  };
  return (
    <div className="flex flex-col items-start gap-1">
      <div
        className={clsx(
          "flex items-center gap-1 font-medium uppercase transition-opacity select-none opacity-30 text-2xs",
          {
            "hover:opacity-50": link,
          }
        )}
        {...{ onClick }}
      >
        <span>{label}</span>
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
  );
};
