import React, { Component } from 'react';
import DropdownList from '@atlaskit/droplist';
import Item, { ItemGroup } from '@atlaskit/item';
import { BlockTrigger } from '../styled/StoryHelpers';

const DroplistMultiLineDemo = class extends Component {
  render() {
    return (
      <div style={{ maxWidth: '400px' }}>
        <DropdownList
          isOpen
          shouldFitContainer
          trigger={
            <BlockTrigger>This is the wide trigger</BlockTrigger>
          }
        >
          <ItemGroup title="Allow multiline">
            <Item shouldAllowMultiline>
              What about if we put some really long content inside this dropdown menu
            </Item>
            <Item shouldAllowMultiline>
              And then we see how the text is hidden, okey now its going to be hidden
            </Item>
          </ItemGroup>
        </DropdownList>
      </div>
    );
  }
};

export default (
  <DroplistMultiLineDemo />
);
