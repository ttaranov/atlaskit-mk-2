// @flow
import React from 'react';
import RadioGlyph from '@atlaskit/icon/glyph/radio';
import { IconWrapper } from './styled/Radio';

type Props = {
  isSelected?: boolean,
  isDisabled?: boolean,
  isFocused?: boolean,
  isActive?: boolean,
  isHovered?: boolean,
  label: string,
  primaryColor: string,
  secondaryColor: string,
};

export default ({
  isSelected,
  isDisabled,
  isFocused,
  isActive,
  isHovered,
  primaryColor,
  secondaryColor,
  label,
}: Props) => (
  <IconWrapper
    isSelected={isSelected}
    isDisabled={isDisabled}
    isFocused={isFocused}
    isActive={isActive}
    isHovered={isHovered}
  >
    <RadioGlyph
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      isHovered={isHovered}
      isActive={isActive}
      label={label}
    />
  </IconWrapper>
);
