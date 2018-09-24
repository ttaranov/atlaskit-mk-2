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
    console.log({ children });
    return (
      <Button
        appearance="subtle"
        ariaLabel={label}
        href={href}
        isSelected={selected}
        onClick={() => {
          onClick && onClick(label);
        }}
      >
        <span>{children}</span>
      </Button>
    );
  }
}
