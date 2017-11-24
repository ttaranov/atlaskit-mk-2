// @flow

import styled from 'styled-components';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: ${5 * akGridSizeUnitless}px;
  margin-bottom: ${akGridSizeUnitless}px;
`;

export default ActionsContainer;
