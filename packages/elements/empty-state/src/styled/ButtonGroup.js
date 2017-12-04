// @flow

import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';

const ButtonGroup = styled.div`
  :not(:first-child) {
    margin-left: ${gridSize()}px;
  }
`;

export default ButtonGroup;
