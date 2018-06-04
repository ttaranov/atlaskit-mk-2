// @flow
import styled from 'styled-components';
import {
  akBorderRadius,
  akGridSizeUnitless,
} from '@atlaskit/util-shared-styles';

const HORIZONTAL_SPACING = `${akGridSizeUnitless / 2}px`;

export default styled.span`
  ${props => `
    background-color: ${props.backgroundColor};
    color: ${props.textColor};
  `};
  border-radius: ${akBorderRadius};
  box-sizing: border-box;

  display: inline-flex;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  max-width: 200px;
  padding: 2px ${HORIZONTAL_SPACING} 3px ${HORIZONTAL_SPACING};
  text-transform: uppercase;
  vertical-align: baseline;
  white-space: nowrap;
`;
