// @flow
import styled from 'styled-components';

import {
  containerOpenWidth,
  containerClosedWidth,
} from '../../../shared-variables';
import { getProvided } from '../../../theme/util';

export default styled.div`
  height: 100%;
  width: ${({ isCollapsed }) =>
    isCollapsed ? containerClosedWidth() : containerOpenWidth}px;
  color: ${({ theme }) => getProvided(theme).text};
  background-color: ${({ theme }) => {
    const background = getProvided(theme).background;
    return background.secondary || background.primary;
  }};
`;
