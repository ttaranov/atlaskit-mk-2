// @flow

import React, { Component } from 'react';
import { CheckboxIcon as CheckboxIconGyph } from '@atlaskit/icon/glyph/checkbox';
import CheckboxIndeterminateIcon from '@atlaskit/icon/glyph/checkbox-indeterminate';
import { ThemeProvider } from 'styled-components';
import { IconWrapper } from './styled/Checkbox';

type Props = {
  /** Primary color */
  primaryColor?: 'inherit',
  /** Secondary color */
  secondaryColor?: 'inherit',
  /** Sets the checkbox icon hovered state */
  isHovered?: boolean,
  /** Sets the checkbox icon active state. */
  isActive?: boolean,
  /** Sets whether the checkbox is indeterminate. This only affects the
   style and does not modify the isChecked property. */
  isIndeterminate?: boolean,
  /** Sets whether the checkbox is disabled. */
  isDisabled?: boolean,
  /** Sets whether the checkbox is checked or unchecked. */
  isChecked: boolean,
  /** Sets whether the checkbox is disabled. */
  isDisabled?: boolean,
  /** Sets the checkbox focus */
  isFocused?: boolean,
  /** Sets the checkbox as invalid */
  isInvalid?: boolean,
};

const emptyTheme = {};

export default class CheckboxIcon extends Component<Props, void> {
  renderCheckboxIcon() {
    const {
      isIndeterminate,
      isHovered,
      isActive,
      primaryColor,
      secondaryColor,
    } = this.props;

    return isIndeterminate ? (
      <CheckboxIndeterminateIcon
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        isHovered={isHovered}
        isActive={isActive}
        label=""
      />
    ) : (
      <CheckboxIconGyph
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        isHovered={isHovered}
        isActive={isActive}
        label=""
      />
    );
  }

  render() {
    const {
      isChecked,
      isDisabled,
      isInvalid,
      isActive,
      isFocused,
      isHovered,
    } = this.props;

    return (
      <ThemeProvider theme={emptyTheme}>
        <IconWrapper
          isChecked={isChecked}
          isDisabled={isDisabled}
          isFocused={isFocused}
          isActive={isActive}
          isHovered={isHovered}
          isInvalid={isInvalid}
        >
          {this.renderCheckboxIcon()}
        </IconWrapper>
      </ThemeProvider>
    );
  }
}
