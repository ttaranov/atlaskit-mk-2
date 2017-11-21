import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';
import styled from 'styled-components';

// tslint:disable-next-line:variable-name
export const OuterContainer = styled.span`
  position: relative;
  margin-right: ${({ width }) =>
    width === 'large' ? 0 : akGridSizeUnitless}px;
  > div {
    display: flex;
  }
`;
