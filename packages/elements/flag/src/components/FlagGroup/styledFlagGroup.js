// @flow
import styled from 'styled-components';
import TransitionGroup from 'react-transition-group/TransitionGroup';

import { gridSize, math, layers } from '@atlaskit/theme';

export default styled.div`
  bottom: ${math.multiply(gridSize, 6)}px;
  left: ${math.multiply(gridSize, 10)}px;
  position: fixed;
  z-index: ${layers.flag};
`;

export const SROnly = styled.h1`
  border: 0;
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

export const Inner = styled(TransitionGroup)`
  position: relative;
`;
