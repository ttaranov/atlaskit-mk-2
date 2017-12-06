// @flow
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { BORDER_WIDTH } from './constants';

// TODO: use math utilities within styled component
const gutterUnitless = gridSize() / 2;
const gutter = `${gutterUnitless}px`;

export const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  line-height: 1;
  margin-left: -${gutter};
  margin-right: -${gutter};

  > * {
    margin-bottom: ${gridSize};
    padding-left: ${gutter};
    padding-right: ${gutter};
  }
`;

export const Stack = styled.div`
  display: flex;
  line-height: 1;
  /* Balance the negative margin of the children */
  margin-right: ${props => BORDER_WIDTH[props.size] * 2 + gutterUnitless}px;

  > * {
    margin-right: -${props => BORDER_WIDTH[props.size] * 2 + gutterUnitless}px;
  }
`;
