import styled from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';

// tslint:disable-next-line:variable-name
export const Placeholder = styled.span`
  margin: 0 0 0 ${gridSize() * 3}px;
  position: absolute;
  color: ${colors.N80};
  pointer-events: none;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: calc(100% - 50px);
`;
