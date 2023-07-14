import { OptionHTMLAttributes, SelectHTMLAttributes } from "react";
import { InputWrapper, InputWrapperProps } from "./InputWrapper";

type Props = SelectHTMLAttributes<HTMLSelectElement> &
  InputWrapperProps & {
    options: Array<
      OptionHTMLAttributes<HTMLOptionElement> & {
        label: string;
      }
    >;
  };

export const Select = ({ label, link, optional, options, ...rest }: Props) => {
  return (
    <InputWrapper {...{ label, link, optional }}>
      <select {...rest}>
        {options.map(({ label, ...rest }) => (
          <option key={rest.value.toString()} {...rest}>
            {label}
          </option>
        ))}
      </select>
    </InputWrapper>
  );
};
