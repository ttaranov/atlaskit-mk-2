// @flow
import React, { PureComponent } from 'react';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

import { ChevronContainer, iconColor, iconColorFocus } from '../styled';

type Props = {
  isExpanded: boolean,
  hasChildren: boolean,
  ariaControls?: string,
  onExpandToggle?: Function,
  key?: string,
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
    if (this.props.hasChildren && this.props.onExpandToggle) {
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
    const { isExpanded, hasChildren, ariaControls } = this.props;
    const { isFocused, isHovered } = this.state;
    const iconProps = {
      size: 'medium',
      primaryColor: isHovered || isFocused ? iconColorFocus : iconColor,
    };
    return (
      <ChevronContainer>
        {hasChildren && (
          <button
            type={'button'}
            aria-expanded={isExpanded}
            aria-controls={ariaControls}
            onClick={this.handleClick}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
          >
            {isExpanded ? (
              <ChevronDownIcon label="Collapse" {...iconProps} />
            ) : (
              <ChevronRightIcon label="Expand" {...iconProps} />
            )}
          </button>
        )}
      </ChevronContainer>
    );
  }
}
