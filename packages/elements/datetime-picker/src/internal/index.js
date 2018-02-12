// @flow

import React from 'react';

export const ClearIndicator = null;

export const DropdownIndicator = ({ icon: Icon }: { icon: any }) =>
  Icon ? (
    <span role="img">
      <Icon />
    </span>
  ) : null;
