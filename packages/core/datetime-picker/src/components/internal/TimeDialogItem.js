// @flow

import React, { Component } from 'react';
import { Item } from '@atlaskit/droplist';

type Handler = (e: any) => void;
type Props = {
  isFocused: boolean,
  onSelect: Handler,
  value: string,
};

export default class TimeDialogItem extends Component<Props> {
  static defaultProps = {
    isFocused: false,
    value: '',
    onSelect() {},
  };

  handleActivate = () => {
    this.props.onSelect(this.props.value);
  };

  render() {
    return (
      <Item
        isFocused={this.props.isFocused}
        onActivate={this.handleActivate}
        type="option"
      >
        {this.props.value}
      </Item>
    );
  }
}
