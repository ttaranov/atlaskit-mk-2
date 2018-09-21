// @flow

import React, { Component } from 'react';
import Icon from '@atlaskit/icon/glyph/checkbox';
import CheckboxIndeterminateIcon from '@atlaskit/icon/glyph/checkbox-indeterminate';
import { IconWrapper } from './styled/Checkbox';
import { type CheckboxIconProps } from './types';

export default class CheckboxIcon extends Component<CheckboxIconProps, void> {
  static defaultProps = {
    primaryColor: 'inherit',
    secondaryColor: 'inherit',
    isIndeterminate: false,
  };

  render() {
    const {
      isChecked,
      isDisabled,
      isInvalid,
      isActive,
      isFocused,
      isHovered,
      isIndeterminate,
      primaryColor,
      secondaryColor,
    } = this.props;
    return (
      <IconWrapper
        isChecked={isChecked}
        isDisabled={isDisabled}
        isFocused={isFocused}
        isActive={isActive}
        isHovered={isHovered}
        isInvalid={isInvalid}
      >
        {isIndeterminate ? (
          <CheckboxIndeterminateIcon
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            isHovered={isHovered}
            isActive={isActive}
            label=""
          />
        ) : (
          <Icon
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            isHovered={isHovered}
            isActive={isActive}
            label=""
          />
        )}
      </IconWrapper>
    );
  }
}
