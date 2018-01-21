// @flow

import styled from 'styled-components';
import { getColor } from './utils';

export default styled.div`
  height: 18px;
  background-color: ${props => getColor(props.color)};
  border-radius: 4px;
  opacity: 0.15;
  margin: 8px;
`;
