// @flow
import React, { Fragment } from 'react';
import RadioIcon from './RadioIcon';
import { HiddenInput } from './styled/Radio';

type RadioInputProps = {
  isActive: boolean,
  isChecked: boolean,
  isDisabled: boolean,
  isFocused: boolean,
  isHovered: boolean,
  isInvalid: boolean,
  isRequired: boolean,
  onChange: event => void,
  onBlur: event => void,
  onFocus: event => void,
  name: string,
  value: string,
};

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
  onBlur,
  onFocus,
  value,
}: RadioInputProps) => {
  return (
    <Fragment>
      <HiddenInput
        checked={isChecked}
        disabled={isDisabled}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
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
    </Fragment>
  );
};

export default RadioInput;
