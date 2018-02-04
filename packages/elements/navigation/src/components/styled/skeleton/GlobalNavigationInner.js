// @flow
import styled from 'styled-components';

import { containerClosedWidth } from '../../../shared-variables';
import { getProvided } from '../../../theme/util';

export default styled.div`
  height: 100%;
  width: ${containerClosedWidth()}px;
  color: ${({ theme }) => getProvided(theme).text};
  background-color: ${({ theme }) => getProvided(theme).background.primary};
`;
