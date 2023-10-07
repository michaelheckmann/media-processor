import { InputHTMLAttributes } from "react";

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & {
  label: string;
};

export const Checkbox = ({ label, ...rest }: Props) => {
  return (
    <label className="flex items-start gap-1.5 cursor-pointer">
      <div className="relative flex mt-[2px]">
        <input
          type="checkbox"
          className="w-[12px] h-[12px] transition-all border rounded appearance-none peer border-stone-600 checked:border-indigo-500 checked:bg-indigo-500"
          {...rest}
        />
        <div className="absolute text-white transition-opacity -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none top-1/2 left-1/2 peer-checked:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-2 h-2"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
      <div className="flex-1 text-xs select-none break-before-all text-stone-400 ">
        {label}
      </div>
    </label>
  );
};
