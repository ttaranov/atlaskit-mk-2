// @flow
import styled from 'styled-components';

import { gridSize, math } from '@atlaskit/theme';

export default styled.div`
  margin-bottom: ${math.divide(gridSize, 2)}px;

  &:last-child {
    margin-bottom: 0;
  }
`;
