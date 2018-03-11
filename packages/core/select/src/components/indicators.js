// @flow

import React from 'react';
import { components } from 'react-select';
import CrossIcon from '@atlaskit/icon/glyph/editor/close';
import DownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';

// indicators
export const ClearIndicator = (props: any) => (
  <components.ClearIndicator {...props}>
    <CrossIcon />
  </components.ClearIndicator>
);
export const DropdownIndicator = (props: any) => (
  <components.DropdownIndicator {...props}>
    <DownIcon />
  </components.DropdownIndicator>
);
