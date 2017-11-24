// @flow

import styled from 'styled-components';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';

const ButtonGroup = styled.div`
  :not(:first-child) {
    margin-left: ${akGridSizeUnitless}px;
  }
`;

export default ButtonGroup;
