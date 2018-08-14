// @flow
import React from 'react';
import Icon from '@atlaskit/icon/glyph/radio';
import { IconWrapper } from './styled/Radio';

type Props = {
  isActive?: boolean,
  isChecked?: boolean,
  isDisabled?: boolean,
  isFocused?: boolean,
  isHovered?: boolean,
  isInvalid?: boolean,
};

export default ({
  isActive,
  isChecked,
  isDisabled,
  isFocused,
  isHovered,
  isInvalid,
}: Props) => (
  <IconWrapper
    isActive={isActive}
    isChecked={isChecked}
    isDisabled={isDisabled}
    isFocused={isFocused}
    isHovered={isHovered}
    isInvalid={isInvalid}
  >
    <Icon
      isActive={isActive}
      isHovered={isHovered}
      label=""
      primaryColor="inherit"
      secondaryColor="inherit"
    />
  </IconWrapper>
);
