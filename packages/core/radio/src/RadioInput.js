// @flow
import React from 'react';
import RadioIcon from './RadioIcon';
import { HiddenInput } from './styled/Radio';
import type { RadioInputProps } from './types';

const RadioInput = ({
  isActive,
  isChecked,
  isDisabled,
  isFocused,
  isHovered,
  isInvalid,
  isRequired,
  name,
  onChange,
  onInvalid,
  onBlur,
  onFocus,
  value,
}: RadioInputProps) => {
  return (
    <span
      style={{
        flexShrink: 0,
        display: 'inline-block',
        position: 'relative',
      }}
    >
      <HiddenInput
        checked={isChecked}
        disabled={isDisabled}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        onInvalid={onInvalid}
        onFocus={onFocus}
        required={isRequired}
        type="radio"
        value={value}
      />
      <RadioIcon
        isActive={isActive}
        isChecked={isChecked}
        isDisabled={isDisabled}
        isFocused={isFocused}
        isHovered={isHovered}
        isInvalid={isInvalid}
      />
    </span>
  );
};

export default RadioInput;
