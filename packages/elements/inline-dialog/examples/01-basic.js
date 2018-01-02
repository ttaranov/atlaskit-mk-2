// @flow
import React from 'react';
import { colors } from '@atlaskit/theme';
import InlineDialog from '../src';

const centeredContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
};

const targetStyles = {
  background: colors.G300,
  padding: '10px',
};

const dialogContent = <div>This is some inline dialog content!</div>;

export default () => (
  <div style={centeredContainerStyles}>
    <InlineDialog content={dialogContent} isOpen>
      <div style={targetStyles}>I am the target</div>
    </InlineDialog>
  </div>
);
