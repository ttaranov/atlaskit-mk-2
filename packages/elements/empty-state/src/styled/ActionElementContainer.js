// @flow

import styled from 'styled-components';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';

const ActionElementContainer = styled.div`
  &:not(:last-child) {
    margin-bottom: ${akGridSizeUnitless}px;
  }
`;

export default ActionElementContainer;
