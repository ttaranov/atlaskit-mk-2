// @flow

import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { getColor, getOpacity } from './utils';

const gridSizeValue: number = gridSize();

const sizes = {
  small: gridSizeValue * 2,
  medium: gridSizeValue * 3,
  large: gridSizeValue * 4,
  xlarge: gridSizeValue * 6,
};

export default styled.div`
  width: ${props => sizes[props.size]}px;
  height: ${props => sizes[props.size]}px;
  display: inline-block;
  border-radius: 50%;
  background-color: ${props => getColor(props.color)};
  opacity: ${props => getOpacity(props.weight)};
`;
