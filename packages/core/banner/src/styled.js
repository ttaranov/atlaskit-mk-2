// @flow
import styled from 'styled-components';
import { colors, gridSize, math, themed } from '@atlaskit/theme';

const TRANSITION_DURATION = '0.25s ease-in-out';

// Container
export const getMaxHeight = ({ isOpen }: { isOpen: boolean }) =>
  isOpen ? '52px' : 0;
export const Container = styled.div`
  max-height: ${getMaxHeight};
  overflow: hidden;
  transition: max-height ${TRANSITION_DURATION};
`;

// Content
export const testErrorBackgroundColor = colors.R400;
export const testErrorTextColor = colors.N0;
export const backgroundColor = themed('appearance', {
  error: { light: colors.R400, dark: colors.R300 },
  warning: { light: colors.Y300, dark: colors.Y300 },
});
export const textColor = themed('appearance', {
  error: { light: colors.N0, dark: colors.DN40 },
  warning: { light: colors.N700, dark: colors.DN40 },
});
export const Content = styled.div`
  align-items: center;
  background-color: ${backgroundColor};
  color: ${textColor};
  display: flex;
  fill: ${backgroundColor};
  font-weight: 500;
  justify-content: center;
  padding: ${math.multiply(gridSize, 2)}px;
  text-align: center;
  transition: color ${TRANSITION_DURATION};

  a,
  a:visited,
  a:hover,
  a:active,
  a:focus {
    color: ${textColor};
    text-decoration: underline;
  }
`;

// Icon
export const Icon = styled.span`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
`;

// Text
export const Text = styled.span`
  flex: 0 1 auto;
  overflow: hidden;
  padding-left: ${math.divide(gridSize, 2)}px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
