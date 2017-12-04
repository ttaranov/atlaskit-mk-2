// @flow
import styled from 'styled-components';
import { colors, themed } from '@atlaskit/theme';
import { getBorderRadius, getInnerStyles } from './utils';
import { BORDER_WIDTH, EXCESS_INDICATOR_FONT_SIZE } from './constants';

const getBorderWidth = p =>
  p.isFocus && !p.isActive ? `${BORDER_WIDTH[p.size]}px` : 0;

export const Outer = styled.button`
  ${getInnerStyles} background: 0;
`;

export const Inner = styled.span`
  background-color: ${themed({ light: colors.N40, dark: colors.DN70 })};
  border-radius: ${getBorderRadius};
  align-items: center;
  box-shadow: 0 0 0 ${getBorderWidth} ${colors.B200};
  color: ${themed({ light: colors.N500, dark: colors.DN400 })};
  cursor: pointer;
  display: flex;
  flex-basis: 100%;
  flex-grow: 1;
  font-size: ${props => EXCESS_INDICATOR_FONT_SIZE[props.size]}px;
  justify-content: center;
  transition: box-shadow 200ms;
`;
