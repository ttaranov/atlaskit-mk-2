// @flow
import styled from 'styled-components';
import { borderRadius, colors, gridSize, math, themed } from '@atlaskit/theme';

const backgroundColor = themed({
  light: colors.N0,
  dark: colors.DN50,
});
const borderColor = themed({
  light: colors.N60A,
  dark: colors.DN60A,
});
const shadowColor = themed({
  light: colors.N50A,
  dark: colors.DN50A,
});

const getBoxShadow = props => {
  const border = `0 0 1px ${borderColor(props)}`;
  const shadow = `0 4px 8px -2px ${shadowColor(props)}`;

  return [border, shadow].join(',');
};

// eslint-disable-next-line import/prefer-default-export
export const Container = styled.div`
  background: ${backgroundColor};
  border-radius: ${borderRadius}px;
  box-shadow: ${getBoxShadow};
  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */
  color: ${colors.text};
  max-height: ${math.multiply(gridSize, 56)}px;
  max-width: ${math.multiply(gridSize, 56)}px;
  padding: ${math.multiply(gridSize, 2)}px ${math.multiply(gridSize, 3)}px;
  z-index: 200;
`;
