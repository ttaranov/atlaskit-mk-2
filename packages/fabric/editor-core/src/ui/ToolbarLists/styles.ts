import { akGridSizeUnitless, akColorN30 } from '@atlaskit/util-shared-styles';
import styled from 'styled-components';

// tslint:disable-next-line:variable-name
export const ButtonGroup = styled.span`
  display: flex;
  align-items: center;

  & > div:not(:first-child) {
    margin-left: ${({ width }) => width === 'large' ? 0 : akGridSizeUnitless}px;
  }

  div {
    display: flex;
  }
`;

// tslint:disable-next-line:variable-name
export const Separator = styled.span`
  background: ${akColorN30};
  width: 1px;
  height: 24px;
  display: inline-block;
  margin: 0 8px;
`;
