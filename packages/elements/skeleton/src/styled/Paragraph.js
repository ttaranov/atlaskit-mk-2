// @flow

import styled from 'styled-components';

import { gridSize, math } from '@atlaskit/theme';

import { getColor, getOpacity } from './utils';

export default styled.div`
  height: ${math.multiply(gridSize, 2.5)}px;
  background-color: ${props => getColor(props.color)};
  border-radius: 4px;
  opacity: ${props => getOpacity(props.weight)};
  margin-left: 8px;
  margin-right: 8px;

  &:not(:first-child) {
    margin-top: ${gridSize()}px;
  }

  &:not(:last-child) {
    margin-bottom: ${gridSize()}px;
  }
`;
