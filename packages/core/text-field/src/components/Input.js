// @flow
import React from 'react';
import { InputWrapper } from '../styled';

type InputProps = any;

const Input = ({
  isDisabled,
  isInvalid,
  isRequired,
  isReadOnly,
  ...props
}: InputProps) => (
  <InputWrapper
    isDisabled={isDisabled}
    isInvalid={isInvalid}
    isRequired={isRequired}
    isReadOnly={isReadOnly}
  >
    <input
      disabled={isDisabled}
      invalid={isInvalid}
      required={isRequired}
      readOnly={isReadOnly}
      {...props}
    />
  </InputWrapper>
);

export default Input;
