// @flow
import React, { PureComponent } from 'react';
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

export default class Chevron extends PureComponent<Props> {
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
    const { isExpanded, ariaControls } = this.props;
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
              <ChevronDownIcon
                label={this.props.collapseLabel}
                {...iconProps}
              />
            ) : (
              <ChevronRightIcon label={this.props.expandLabel} {...iconProps} />
            )}
          </ChevronIconContainer>
        </Button>
      </ChevronContainer>
    );
  }
}
