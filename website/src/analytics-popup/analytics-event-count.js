// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';
import Badge from '@atlaskit/badge';
import {
  borderRadius,
  gridSize,
  math,
  colors,
  elevation,
} from '@atlaskit/theme';

type Props = {
  count: number,
};

const Count = ({ count }: Props) => {
  return (
    <div>
      <Badge>{count}</Badge> events
    </div>
  );
};

export default Count;
