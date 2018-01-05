// @flow
import React from 'react';
import { colors } from '@atlaskit/theme';
import InlineDialog from '../src';

const centeredContainerStyles = {
  display: 'flex',
  height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
};

const targetStyles = {
  background: colors.G300,
  padding: '10px',
};

export default () => (
  <div style={centeredContainerStyles}>
    <InlineDialog
      content="I will flip to the top instead of the right!"
      position="left middle"
      isOpen
      shouldFlip={['top']}
    >
      <div style={targetStyles}>I am the target</div>
    </InlineDialog>
  </div>
);
