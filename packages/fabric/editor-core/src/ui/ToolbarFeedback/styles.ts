import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';
import styled from 'styled-components';

// tslint:disable-next-line:variable-name
export const ButtonContent = styled.span`
  display: flex;
  height: 24px;
  min-width: 65px;
  padding: 0 5px;
  align-items: center;
`;

// tslint:disable-next-line:variable-name
export const Wrapper = styled.span`
  display: flex;
  margin-right: ${({ width }) =>
    !width || width === 'large' ? 0 : akGridSizeUnitless}px;
`;
