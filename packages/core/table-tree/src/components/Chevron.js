// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

import { ChevronContainer, ChevronIconContainer, iconColor } from '../styled';

type Props = {
  isExpanded: boolean,
  ariaControls: string,
  onExpandToggle?: Function,
  expandLabel: string,
  collapseLabel: string,
};

export default class Chevron extends Component<Props> {
  static defaultProps = {
    expandLabel: 'Expand',
    collapseLabel: 'Collapse',
  };

  handleClick = () => {
    if (this.props.onExpandToggle) {
      this.props.onExpandToggle();
    }
  };

  render() {
    const { isExpanded, ariaControls, collapseLabel, expandLabel } = this.props;
    const iconProps = {
      size: 'medium',
      primaryColor: iconColor,
    };
    return (
      <ChevronContainer>
        <Button
          spacing="none"
          appearance="subtle"
          ariaControls={ariaControls}
          onClick={this.handleClick}
        >
          <ChevronIconContainer>
            {isExpanded ? (
              <ChevronDownIcon label={collapseLabel} {...iconProps} />
            ) : (
              <ChevronRightIcon label={expandLabel} {...iconProps} />
            )}
          </ChevronIconContainer>
        </Button>
      </ChevronContainer>
    );
  }
}
