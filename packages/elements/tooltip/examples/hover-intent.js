// @flow
import React from 'react';
import { Target } from './styled';
import Tooltip from '../src';

const colors = ['teal', 'blue', 'purple'];

export default () => (
  <div style={{ display: 'flex' }}>
    {colors.map((c, i) => (
      <Tooltip key={c} content={`Content ${i + 1}`} position="top">
        <Target color={c} style={{ marginRight: 8 }}>
          Target {i + 1}
        </Target>
      </Tooltip>
    ))}
  </div>
);
