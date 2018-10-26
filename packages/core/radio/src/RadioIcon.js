// @flow
import React, { Component } from 'react';
import Icon from '@atlaskit/icon/glyph/radio';
import { IconWrapper } from './styled/Radio';
import type { RadioIconProps } from './types';

export default function RadioIcon (props) {
  render() {
    const {
      isActive,
      isChecked,
      isDisabled,
      isFocused,
      isHovered,
      isInvalid,
    } = this.props;
    return (
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
  }
}
