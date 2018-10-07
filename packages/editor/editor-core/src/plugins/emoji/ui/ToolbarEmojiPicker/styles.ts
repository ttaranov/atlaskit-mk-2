import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';

export const OuterContainer = styled.span`
  position: relative;
  margin-right: ${({ width }: { width: 'small' | 'large' }) =>
    !width || width === 'large' ? 0 : gridSize()}px;
  > div {
    display: flex;
  }
`;
