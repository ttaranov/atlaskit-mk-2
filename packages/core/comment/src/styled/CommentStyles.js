// @flow

import styled from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';

const ThemeColor = {
  text: {
    default: colors.N800, //akColorN800,
    disabled: colors.N100A,
  },
};

export const Content = styled.div`
  color: ${p =>
    p.isDisabled ? ThemeColor.text.disabled : ThemeColor.text.default};
  margin-top: ${gridSize() / 2}px;
`;
