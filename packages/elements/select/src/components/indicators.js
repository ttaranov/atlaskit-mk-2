// @flow

import React from 'react';
import { components } from 'react-select';
import CrossIcon from '@atlaskit/icon/glyph/editor/close';
import DownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';

// indicators
export const ClearIndicator = p => (
  <components.ClearIndicator {...p}>
    <CrossIcon />
  </components.ClearIndicator>
);
export const DropdownIndicator = p => (
  <components.DropdownIndicator {...p}>
    <DownIcon />
  </components.DropdownIndicator>
);
