// @flow

import React, { Component } from 'react';
import Item, { ItemGroup } from '@atlaskit/item';
import DropList from '../../src';

const items = Array(4).fill(true).map((item, index) => (
  <Item key={index}>Item {index + 1}</Item>
));

type Props = {
  /** TODO */
  appearance?: 'normal' | 'tall',
  /** TODO */
  withGroup?: boolean,
};
class BoundariesElementExample extends Component {

  componentDidMount() {
    this.scroll.scrollTop = 200;
  }
  props: Props;
  scroll: HTMLDivElement;

  render() {
    const content = this.props.withGroup ? (
      <ItemGroup title="Items">
        {items}
      </ItemGroup>
    ) : items;
    return (
      <div>
        <p>Scroll up to reposition the droplist</p>
        <div
          style={{ border: '1px solid black', height: '200px', width: '300px', overflow: 'scroll' }}
          ref={ref => { this.scroll = ref; }}
        >
          <div style={{ width: '300px', height: '600px', paddingTop: '200px' }} >
            <DropList
              appearance={this.props.appearance}
              boundariesElement="scrollParent"
              isOpen
              trigger="Hello"
            >
              {content}
            </DropList>
          </div>
        </div>
      </div>
    );
  }
}

export default (
  <BoundariesElementExample />
);
