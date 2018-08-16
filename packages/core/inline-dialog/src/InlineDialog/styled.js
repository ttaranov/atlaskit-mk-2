// @flow
import styled from 'styled-components';
import {
  borderRadius,
  colors,
  gridSize,
  math,
  themed,
  elevation,
  layers,
} from '@atlaskit/theme';

const backgroundColor = themed({ light: colors.N0, dark: colors.DN50 });
const textColor = themed({ light: colors.N900, dark: colors.DN600 });

// eslint-disable-next-line import/prefer-default-export
export const Container = styled.div`
  background: ${backgroundColor};
  border-radius: ${borderRadius}px;
  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */
  color: ${textColor};
  max-height: ${math.multiply(gridSize, 56)}px;
  max-width: ${math.multiply(gridSize, 56)}px;
  padding: ${math.multiply(gridSize, 2)}px ${math.multiply(gridSize, 3)}px;
  z-index: ${layers.dialog};

  ${elevation.e200};

  &:focus {
    outline: none;
  }
`;
