//@flow
import React, { Component, type Node } from 'react';
import Button from '@atlaskit/button';

type Props = {
  label?: string,
  href?: string,
  selected?: boolean,
  onClick?: Function,
  children?: Node,
};

export default class Link extends Component<Props> {
  render() {
    const { label, href, onClick, selected, children } = this.props;
    return (
      <Button
        appearance="subtle"
        href={href}
        isSelected={selected}
        onClick={onClick}
      >
        {children}
      </Button>
    );
  }
}
