// @flow

import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { akTypographyMixins } from '@atlaskit/util-shared-styles';

const Header = styled.h4`
  ${akTypographyMixins.h600};
  margin-top: 0;
  margin-bottom: ${gridSize() * 2}px;
`;

export default Header;
