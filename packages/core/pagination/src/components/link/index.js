//@flow
import React, { Component, type Node } from 'react';
import Button from '@atlaskit/button';
import type { LinkPropsType } from '../../types';

export default class Link extends Component<LinkPropsType> {
  render() {
    const { ariaLabel, href, onClick, isSelected, children } = this.props;
    return (
      <Button
        appearance="subtle"
        ariaLabel={ariaLabel}
        href={href}
        isSelected={isSelected}
        onClick={() => {
          onClick && onClick(ariaLabel);
        }}
      >
        <span>{children}</span>
      </Button>
    );
  }
}
