// @flow

import styled from 'styled-components';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';

const HORIZONTAL_SPACING = `${akGridSizeUnitless / 2}px`;

export default styled.span`
  display: inline-block;
  vertical-align: top;
  overflow-x: hidden;
  overflow-y: hidden;
  text-overflow: ${props => (props.inlineEditing ? 'string' : 'ellipsis')};
  white-space: nowrap;
  box-sizing: border-box;
  padding: 0 ${HORIZONTAL_SPACING};
  max-width: ${props =>
    typeof props.maxWidth === 'number'
      ? `${props.maxWidth}px`
      : props.maxWidth};
  width: 100%;
`;
