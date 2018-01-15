// @flow
import React, { PureComponent } from 'react';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

import { ChevronContainer, iconColor } from '../styled';

type Props = {
  isExpanded: boolean,
  hasChildren: boolean,
  ariaControls?: string,
  onExpandToggle?: Function,
  key?: string,
};

export default class Chevron extends PureComponent<Props> {
  handleClick = () => {
    if (this.props.hasChildren && this.props.onExpandToggle) {
      this.props.onExpandToggle();
    }
  };

  render() {
    const { isExpanded, hasChildren, ariaControls } = this.props;
    const iconProps = {
      onClick: this.handleClick,
      size: 'medium',
      primaryColor: iconColor,
    };
    return (
      <ChevronContainer>
        {hasChildren && (
          <button aria-expanded={isExpanded} aria-controls={ariaControls}>
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
