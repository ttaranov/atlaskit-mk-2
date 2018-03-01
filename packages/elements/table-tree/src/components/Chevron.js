// @flow
import React, { PureComponent } from 'react';
import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

import {
  ChevronContainer,
  ChevronIconContainer,
  iconColor,
  iconColorFocus,
} from '../styled';

type Props = {
  isExpanded: boolean,
  ariaControls: string,
  onExpandToggle?: Function,
};

type State = {
  isFocused: boolean,
  isHovered: boolean,
};

export default class Chevron extends PureComponent<Props, State> {
  state: State = {
    isFocused: false,
    isHovered: false,
  };

  handleClick = () => {
    if (this.props.onExpandToggle) {
      this.props.onExpandToggle();
    }
  };

  handleMouseOver = () => {
    this.setState({ isHovered: true });
  };

  handleMouseOut = () => {
    this.setState({ isHovered: false });
  };

  handleFocus = () => {
    this.setState({ isFocused: true });
  };

  handleBlur = () => {
    this.setState({ isFocused: false });
  };

  render() {
    const { isExpanded, ariaControls } = this.props;
    const { isFocused, isHovered } = this.state;
    const iconProps = {
      size: 'medium',
      primaryColor: isHovered || isFocused ? iconColorFocus : iconColor,
    };
    return (
      <ChevronContainer>
        <Button
          spacing="none"
          appearance="subtle"
          ariaControls={ariaControls}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
        >
          <ChevronIconContainer>
            {isExpanded ? (
              <ChevronDownIcon label="Collapse" {...iconProps} />
            ) : (
              <ChevronRightIcon label="Expand" {...iconProps} />
            )}
          </ChevronIconContainer>
        </Button>
      </ChevronContainer>
    );
  }
}
