import { InputHTMLAttributes } from "react";
import { InputWrapper, InputWrapperProps } from "./InputWrapper";

type Props = InputHTMLAttributes<HTMLInputElement> & InputWrapperProps;

export const Input = ({ label, link, optional, tooltip, ...rest }: Props) => {
  return (
    <InputWrapper {...{ label, link, tooltip, optional }}>
      <input {...rest} />
    </InputWrapper>
  );
};
