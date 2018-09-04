// @flow
import styled from 'styled-components';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';

export default styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${props =>
    typeof props.maxWidth === 'number'
      ? `${props.maxWidth - akGridSizeUnitless}px`
      : props.maxWidth};
`;
