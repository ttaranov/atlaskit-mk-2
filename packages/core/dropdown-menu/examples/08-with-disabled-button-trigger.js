// @flow

import React from 'react';
import { defaultProps as defaultButtonProps } from '@atlaskit/button';
import DropdownMenu, { DropdownItemGroup, DropdownItem } from '../src';

export default () => (
  <DropdownMenu
    trigger="Disabled trigger"
    triggerType="button"
    triggerButtonProps={{ ...defaultButtonProps, isDisabled: true }}
  >
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
      <DropdownItem>Melbourne</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);
