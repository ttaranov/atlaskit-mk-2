// @flow
import React, { Component } from 'react';
import { Theme } from '@atlaskit/theme';
import Icon from '@atlaskit/icon/glyph/radio';
import { IconWrapper } from './styled/Radio';
import defaultTheme from './theme';
import type { RadioIconProps } from './types';

export default class RadioIcon extends Component<RadioIconProps> {
  static defaultProps = {
    theme: defaultTheme,
  };
  render() {
    const {
      isActive,
      isChecked,
      isDisabled,
      isFocused,
      isHovered,
      isInvalid,
      theme,
    } = this.props;
    return (
      <Theme values={theme}>
        {t => (
          <IconWrapper
            {...t.radio({
              isActive,
              isChecked,
              isDisabled,
              isFocused,
              isHovered,
              isInvalid,
            })}
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
        )}
      </Theme>
    );
  }
}
