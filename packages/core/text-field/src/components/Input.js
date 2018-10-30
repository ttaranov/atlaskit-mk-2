// @flow

import React from 'react';
import { InputWrapper } from '../styled';

type InputProps = {
  appearance: boolean,
  isDisabled: boolean,
  isFocused: boolean,
  isInvalid: boolean,
  isReadOnly: boolean,
  isRequired: boolean,
};

export default ({
  appearance,
  isDisabled,
  isFocused,
  isInvalid,
  isReadOnly,
  isRequired,
  ...props
}: InputProps) => (
  <InputWrapper
    appearance={appearance}
    isDisabled={isDisabled}
    isFocused={isFocused}
    isInvalid={isInvalid}
    isReadOnly={isReadOnly}
    isRequired={isRequired}
  >
    <input
      disabled={isDisabled}
      invalid={isInvalid}
      readOnly={isReadOnly}
      required={isRequired}
      {...props}
    />
  </InputWrapper>
);
