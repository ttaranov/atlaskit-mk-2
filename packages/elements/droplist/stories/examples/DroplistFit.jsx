import React, { Component } from 'react';
import DropdownList from '@atlaskit/droplist';
import Item, { ItemGroup } from '@atlaskit/item';
import { BlockTrigger } from '../styled/StoryHelpers';

const DroplistOverview = class extends Component {
  render() {
    return (
      <DropdownList
        isOpen
        shouldFitContainer
        trigger={
          <BlockTrigger>This is the wide trigger</BlockTrigger>
        }
      >
        <ItemGroup title="Australia">
          <Item>Sydney</Item>
          <Item isHidden>Darwin</Item>
          <Item isDisabled>Brisbane</Item>
          <Item>Canberra</Item>
          <Item>Melbourne</Item>
        </ItemGroup>
      </DropdownList>
    );
  }
};

export default (
  <DroplistOverview />
);
