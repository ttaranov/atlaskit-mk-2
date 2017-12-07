// @flow
import React, { PureComponent, type Element } from 'react';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

import { ChevronContainer, iconColor } from '../styled';

type Props = {
  isExpanded: boolean,
  hasChildren: boolean,
  onExpandToggle: Function,
};

export default class Chevron extends PureComponent<Props> {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.hasChildren) {
      this.props.onExpandToggle();
    }
  }

  render() {
    const { isExpanded, hasChildren } = this.props;
    const iconProps = {
      onClick: this.handleClick,
      size: 'medium',
      primaryColor: iconColor,
    };
    let icon = null;
    if (hasChildren) {
      icon = isExpanded ? (
        <ChevronDownIcon label="Collapse" {...iconProps} />
      ) : (
        <ChevronRightIcon label="Expand" {...iconProps} />
      );
    }
    return <ChevronContainer>{icon}</ChevronContainer>;
  }
}
