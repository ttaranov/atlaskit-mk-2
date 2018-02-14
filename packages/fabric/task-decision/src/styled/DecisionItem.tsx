import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';

// tslint:disable-next-line:variable-name
export const EditorIconWrapper = styled.span`
  flex: 0 0 16px;
  height: 16px;
  width: 16px;
  color: ${props => props.color || 'inherit'}
  margin: 2px ${gridSize}px 0 0;

  > span {
    margin: -8px;
  }
`;
