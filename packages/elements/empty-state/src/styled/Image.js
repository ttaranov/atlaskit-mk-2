// @flow

import styled from 'styled-components';

import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';

const Image = styled.img`
  max-width: ${props => props.maxImageWidth}px;
  max-height: ${props => props.maxImageHeight}px;
  margin: 0 auto ${akGridSizeUnitless * 3}px;
  display: block;
`;

export default Image;
