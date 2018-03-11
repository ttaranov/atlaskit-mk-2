// @flow
import styled from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';

const Expand = styled.div`
  align-items: center;
  display: flex;
  flex: 0 0 ${math.multiply(gridSize, 3)}px;
  justify-content: center;
  margin: 0 ${gridSize}px;
`;

Expand.displayName = 'SingleSelectExpand';

export default Expand;
