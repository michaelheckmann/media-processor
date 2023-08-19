import { InputHTMLAttributes, useEffect, useState } from "react";
import { InputWrapper, InputWrapperProps } from "./InputWrapper";

type Props = InputHTMLAttributes<HTMLInputElement> & InputWrapperProps;

export const Input = ({
  label,
  link,
  optional,
  tooltip,
  onKeyDown,
  value,
  ...rest
}: Props) => {
  const [localValue, setLocalValue] = useState(value?.toString() ?? "");

  useEffect(() => {
    setLocalValue(value?.toString() ?? "");
  }, [value]);

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
        setLocalValue((prevValue) => {
          const newValue = Number(prevValue) + 1;
          rest.onChange?.({ target: { value: newValue } } as any);
          return newValue.toString();
        });
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setLocalValue((prevValue) => {
          const newValue = Number(prevValue) - 1;
          rest.onChange?.({ target: { value: newValue } } as any);
          return newValue.toString();
        });
      }
    }
    onKeyDown?.(event);
  };

  return (
    <InputWrapper {...{ label, link, tooltip, optional }}>
      <input value={localValue} onKeyDown={handleKeyDown} {...rest} />
    </InputWrapper>
  );
};
