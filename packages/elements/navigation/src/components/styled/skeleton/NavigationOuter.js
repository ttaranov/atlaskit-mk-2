// @flow
import styled from 'styled-components';

import {
  standardOpenWidth,
  containerClosedWidth,
} from '../../../shared-variables';

export default styled.div`
  width: ${({ isCollapsed }) =>
    isCollapsed ? containerClosedWidth() : standardOpenWidth}px;
  height: 100vh;
`;
