import {
  akGridSizeUnitless
} from '@atlaskit/util-shared-styles';
import styled from 'styled-components';

// tslint:disable-next-line:variable-name
export const Wrapper = styled.span`
  display: flex;
  align-items: center;
  > div > div {
    display: flex;
  }
`;

// tslint:disable-next-line:variable-name
export const InnerWrapper = styled.span`
  display: flex;
  align-items: center;
  > * {
    margin-right: ${({ width }) => width === 'large' ? 0 : akGridSizeUnitless}px;
  }
  div {
    display: flex;
  }
`;

// tslint:disable-next-line:variable-name
export const ExpandIconWrapper = styled.div`
  margin-left: -8px;
`;
