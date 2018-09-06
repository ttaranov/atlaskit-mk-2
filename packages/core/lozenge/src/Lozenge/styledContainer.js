// @flow
import styled from 'styled-components';
import { akBorderRadius } from '@atlaskit/util-shared-styles';

export default styled.span`
  ${props => `
    background-color: ${props.backgroundColor};
    color: ${props.color};
  `};
  border-radius: ${akBorderRadius};
  box-sizing: border-box;

  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  max-width: ${props => props.maxWidth};
  padding: 2px 0 3px 0;
  text-transform: uppercase;
  vertical-align: baseline;
`;
