// @flow
import styled from 'styled-components';
import {
  akColorR50,
  akColorR500,
  akGridSizeUnitless,
  akHelperMixins,
} from '@atlaskit/util-shared-styles';

import { buttonWidthUnitless, borderRadius, tagHeight } from './constants';
import theme from './theme';

const getColor = ({ markedForRemoval, color }) => (
  markedForRemoval ? akColorR500 : theme.tag[color].normal.text
);

export default styled.span`
  ${akHelperMixins.focusRing.default};
  background-color: ${({ markedForRemoval, color }) => (markedForRemoval ? akColorR50 : theme.tag[color].normal.background)};
  color: ${getColor};
  border-radius: ${({ isRounded }) => (isRounded ? `${buttonWidthUnitless / 2}px` : borderRadius)};
  cursor: default;
  display: flex;
  height: ${tagHeight};
  line-height: 1;
  margin: ${akGridSizeUnitless / 2}px;
  padding: 0;
  overflow: ${({ isRemoved, isRemoving }) => ((isRemoved || isRemoving) ? 'hidden' : 'initial')};

  &:hover {
    ${akHelperMixins.focusRing.none};
    background-color: ${({ markedForRemoval, color }) => (markedForRemoval ? akColorR50 : theme.tag[color].hover.background)};
    color: ${({ color }) => theme.tag[color].hover.text};
  }
`;
