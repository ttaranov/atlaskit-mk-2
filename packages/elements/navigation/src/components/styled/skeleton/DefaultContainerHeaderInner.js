// @flow
import styled from 'styled-components';

import { gridSize, math } from '@atlaskit/theme';

export default styled.div`
  display: flex;
  align-items: center;
  margin: ${math.divide(gridSize, 2)}px ${gridSize()}px 0 ${gridSize()}px;
`;
