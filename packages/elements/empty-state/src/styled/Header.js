// @flow

import styled from 'styled-components';
import {
  akGridSizeUnitless,
  akTypographyMixins,
} from '@atlaskit/util-shared-styles';

const Header = styled.h4`
  ${akTypographyMixins.h600};
  margin-top: 0;
  margin-bottom: ${akGridSizeUnitless * 2}px;
`;

export default Header;
