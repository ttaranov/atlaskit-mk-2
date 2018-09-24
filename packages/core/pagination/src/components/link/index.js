//@flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import type { LinkPropsType } from '../../types';

export default class Link extends Component<LinkPropsType> {
  static defaultProps = {
    onClick: () => {},
  };

  render() {
    const { ariaLabel, href, onClick, isSelected, children } = this.props;
    return (
      <Button
        appearance="subtle"
        ariaLabel={ariaLabel}
        href={href}
        isSelected={isSelected}
        onClick={e => onClick(ariaLabel, e)}
      >
        <span>{children}</span>
      </Button>
    );
  }
}
