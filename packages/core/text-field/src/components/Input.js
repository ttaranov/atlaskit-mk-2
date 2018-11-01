// @flow

import React from 'react';
import { InputWrapper } from '../styled';
import type { InputProps } from '../types';

export default ({
  appearance,
  forwardedRef,
  isCompact,
  isDisabled,
  isFocused,
  isMonospaced,
  isReadOnly,
  isRequired,
  ...props
}: InputProps) => (
  <InputWrapper
    appearance={appearance}
    isCompact={isCompact}
    isDisabled={isDisabled}
    isFocused={isFocused}
    isMonospaced={isMonospaced}
    isReadOnly={isReadOnly}
    isRequired={isRequired}
  >
    <input
      ref={forwardedRef}
      disabled={isDisabled}
      readOnly={isReadOnly}
      required={isRequired}
      {...props}
    />
  </InputWrapper>
);
