// @flow

import styled from 'styled-components';

import { getColor } from './utils';

const sizes = {
  small: '16px',
  medium: '24px',
  large: '32px',
  xlarge: '48px',
};

export default styled.div`
  width: ${props => sizes[props.size]};
  height: ${props => sizes[props.size]};
  display: inline-block;
  border-radius: 50%;
  background-color: ${props => getColor(props.color)};
  opacity: 0.15;
`;
