// @flow

import React from 'react';

export const LayoutContainer = (props: {}) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
    }}
    {...props}
  />
);

export const NavContainer = (props: {}) => (
  <div
    css={{
      bottom: 0,
      display: 'flex',
      flexDirection: 'row',
      left: 0,
      position: 'fixed',
      top: 0,
    }}
    {...props}
  />
);
