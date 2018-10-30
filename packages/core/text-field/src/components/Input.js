// @flow
import React from 'react';
import { InputWrapper } from '../styled';

type InputProps = any;
export default ({
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
