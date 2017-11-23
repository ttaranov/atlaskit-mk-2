// @flow
import React, { PureComponent, type Element } from 'react';
import { BulletIcon } from '../styled';

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
    let text = '*';
    if (hasChildren) {
      text = isExpanded ? '[-]' : '[+]';
    }
    return (
      <BulletIcon>
        <span
          onClick={this.handleClick}
          role="button"
          tabIndex={-1}
          style={{ display: 'inline-block' }}
        >
          {text}
        </span>
      </BulletIcon>
    );
  }
}
