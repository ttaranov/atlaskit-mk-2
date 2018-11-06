// @flow
import React, { Component } from 'react';
import Item, { ItemGroup } from '@atlaskit/item';
import DropList from '../src';

export default class BoundingExample extends Component<void, void> {
  render() {
    return (
      <div>
        <p>Scroll up to reposition the droplist</p>
        <div
          style={{
            border: '1px solid black',
            boxSizing: 'border-box',
            height: '200px',
            width: '300px',
            overflow: 'auto',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '600px',
              height: '2000px',
              padding: '200px 0 0 200px',
            }}
          >
            <DropList isOpen trigger={<span>Trigger</span>}>
              <ItemGroup title="Australia">
                <Item>Sydney</Item>
                <Item isHidden>Darwin</Item>
                <Item isDisabled>Brisbane</Item>
                <Item>Canberra</Item>
                <Item>Melbourne</Item>
              </ItemGroup>
            </DropList>
          </div>
        </div>
      </div>
    );
  }
}
