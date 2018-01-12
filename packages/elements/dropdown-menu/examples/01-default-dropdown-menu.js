// @flow

import React from 'react';
import DropdownMenu, { DropdownItemGroup, DropdownItem } from '../src';

export default () => (
  <DropdownMenu
    trigger="Choices"
    triggerType="button"
    shouldFlip={false}
    position="right middle"
    onOpenChange={e => console.log('dropdown opened', e)}
  >
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
      <DropdownItem>Melbourne</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);
