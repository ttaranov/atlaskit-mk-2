// @flow
import styled from 'styled-components';
import {
  onClickStyle,
  truncateStyle,
  arrowsStyle,
  cellStyle,
} from './constants';
import { head } from '../theme';

export const Head = styled.thead`
  border-bottom: 2px solid ${head.borderColor};
`;

export const HeadCell = styled.th`
  ${p => onClickStyle(p)} ${p => truncateStyle(p)} ${p =>
      arrowsStyle(p)} ${cellStyle} border: none;
  color: ${head.textColor};
  font-size: 12px;
  font-weight: 600;
  position: relative;
  text-align: left;
  vertical-align: top;
`;
