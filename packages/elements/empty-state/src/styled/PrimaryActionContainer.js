// @flow

import styled from 'styled-components';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';

const PrimaryActionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: ${5 * akGridSizeUnitless}px;
`;

export default PrimaryActionContainer;
