// @flow

import styled from 'styled-components';
import { getColor, getOpacity } from './utils';

export default styled.div`
  height: 18px;
  background-color: ${props => getColor(props.color)};
  border-radius: 4px;
  opacity: ${props => getOpacity(props.appearance)};
  margin: 8px;
`;
