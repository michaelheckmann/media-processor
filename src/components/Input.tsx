import { InputHTMLAttributes } from "react";
import { InputWrapper, InputWrapperProps } from "./InputWrapper";

type Props = InputHTMLAttributes<HTMLInputElement> & InputWrapperProps;

export const Input = ({ label, link, optional, ...rest }: Props) => {
  return (
    <InputWrapper {...{ label, link, optional }}>
      <input {...rest} />
    </InputWrapper>
  );
};
