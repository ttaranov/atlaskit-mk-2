import React, { Component } from 'react';
import Button from '@atlaskit/button';
import DropList from '@atlaskit/droplist';
import Item, { ItemGroup } from '@atlaskit/item';

const DroplistOverview = class extends Component {
  render() {
    return (
      <DropList
        appearance="default"
        isOpen
        isTriggerNotTabbable
        onOpenChange={(attrs) => {
          console.log(attrs.isOpen);
        }}
        position="right top"
        trigger={<Button isSelected>...</Button>}
      >
        <ItemGroup title="Australia">
          <Item href="//atlassian.com" target="_blank">Sydney</Item>
          <Item isHidden>Hidden item</Item>
          <Item isDisabled>Brisbane</Item>
          <Item>Canberra</Item>
          <Item
            onActivated={(attrs) => {
              console.log(attrs.item);
            }}
          >Melbourne</Item>
        </ItemGroup>
      </DropList>
    );
  }
};

export default (
  <DroplistOverview />
);
