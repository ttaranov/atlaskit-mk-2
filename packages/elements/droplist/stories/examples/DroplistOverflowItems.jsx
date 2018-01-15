import React, { Component } from 'react';
import DropdownList from '@atlaskit/droplist';
import Item, { ItemGroup } from '@atlaskit/item';
import Arrow from '@atlaskit/icon/glyph/arrow-right';
import Lozenge from '@atlaskit/lozenge';
import { BlockTrigger } from '../styled/StoryHelpers';

const DroplistOverview = class extends Component {
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
          <Item>This is not that long</Item>
          <Item type="checkbox">
            some checkbox with a long long long long long long content
          </Item>
          <Item
            elemAfter={
              <div style={{ display: 'flex', alignItems: 'center', width: '105px' }}>
                <Arrow label="" /><Lozenge appearance="success">done</Lozenge>
              </div>
            }
          >this item should display an arrow with a done lozenge</Item>
          <ItemGroup title="Some heading">
            <Item>What about if we put some really long content inside this dropdown menu</Item>
            <Item>And then we see how the text is hidden, okey now its going to be hidden </Item>
          </ItemGroup>
        </DropdownList>
      </div>
    );
  }
};

export default (
  <DroplistOverview />
);
