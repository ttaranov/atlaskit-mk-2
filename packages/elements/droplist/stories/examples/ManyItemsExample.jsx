// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Item, { ItemGroup } from '@atlaskit/item';
import DropList from '../../src';

const items = Array(12).fill(true).map((item, index) => (
  <Item key={index}>Item {index + 1}</Item>
));

export default class ManyItemsExample extends Component {
  static propTypes = {
    appearance: PropTypes.oneOf(['normal', 'tall']),
    withGroup: PropTypes.bool,
  }

  render() {
    const content = this.props.withGroup ? (
      <ItemGroup title="Items">
        {items}
      </ItemGroup>
    ) : items;
    return (
      <DropList
        appearance={this.props.appearance}
        isOpen
        trigger="Hello"
      >
        {content}
      </DropList>
    );
  }
}
