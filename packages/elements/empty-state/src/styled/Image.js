// @flow

import styled from 'styled-components';

import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';

const Image = styled.img`
  max-width: 160px;
  max-height: 160px;
  margin: 0 auto ${akGridSizeUnitless * 3}px;
  display: block;
`;

export default Image;
