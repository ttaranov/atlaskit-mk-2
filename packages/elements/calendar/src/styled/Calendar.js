/* eslint no-confusing-arrow: 0 */

import styled, { css } from 'styled-components';
import { colors, themed, borderRadius } from '@atlaskit/theme';

const wrapperBackgroundColor = themed({ light: colors.N0, dark: colors.N700 });

const borderColor = themed({ light: colors.N60A, dark: colors.DN60A });
const shadowColor = themed({ light: colors.N50A, dark: colors.DN50A });

const getCalendarThColor = themed({ light: colors.N80, dark: colors.N80 });

const getBoxShadow = props => {
  const border = `0 0 1px ${borderColor(props)}`;
  const shadow = `0 4px 8px -2px ${shadowColor(props)}`;

  return [border, shadow].join(',');
};

export const Announcer = styled.div`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`;

export const CalendarTable = styled.table`
  display: inline-block;
  margin: 0;
  text-align: center;
`;

export const CalendarTbody = styled.tbody`
  border: 0;
`;

// FIXME: first-child
// @atlaskit/css-reset should adjust default behaviours
const thSpacing = css`padding: 6px 8px`;
export const CalendarTh = styled.th`
  border: 0;
  color: ${getCalendarThColor};
  font-size: 8px;
  padding: ${thSpacing};
  text-transform: uppercase;
  text-align: center;

  &:last-child,
  &:first-child {
    padding: ${thSpacing};
  }
`;

export const CalendarThead = styled.thead`
  border: 0;
`;

export const Wrapper = styled.div`
  background-color: ${wrapperBackgroundColor};
  color: ${colors.text};
  display: inline-block;
  padding: 10px;
  user-select: none;
  border-radius: ${borderRadius}px;
  box-shadow: ${getBoxShadow};
  box-sizing: border-box;
  outline: none;
`;
