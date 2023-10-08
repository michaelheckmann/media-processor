import { InputHTMLAttributes, useState } from "react";
import { InputWrapper, InputWrapperProps } from "./InputWrapper";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> &
  InputWrapperProps & {
    onChange: (value: string) => void;
  };

export const Input = ({
  label,
  link,
  optional,
  tooltip,
  onKeyDown,
  value,
  onChange,
  ...rest
}: Props) => {
  const [localValue, setLocalValue] = useState(value?.toString() ?? "");
  const updateVal = (val: string | number) => {
    setLocalValue(val?.toString() ?? "");
    onChange(val.toString());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (rest.type === "number") {
      if (rest.min && Number(localValue) < Number(rest.min)) {
        return;
      }
      if (rest.max && Number(localValue) > Number(rest.max)) {
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        const newValue = (Number(localValue) + 1).toString();
        updateVal(newValue);
        setLocalValue(newValue);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        const newValue = (Number(localValue) - 1).toString();
        updateVal(newValue);
        setLocalValue(newValue);
      }
    }
    onKeyDown?.(event);
  };

  return (
    <InputWrapper {...{ label, link, tooltip, optional }}>
      <input
        value={localValue}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          updateVal(e.target.value);
        }}
        {...rest}
      />
    </InputWrapper>
  );
};
