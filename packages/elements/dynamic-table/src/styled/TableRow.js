// @flow
import styled from 'styled-components';
import { onClickStyle, truncateStyle, cellStyle } from './constants';
import { row } from '../theme';

export const TableBodyRow = styled.tr`
  ${props => onClickStyle(props)} &:hover {
    background: ${row.hoverBackground};
  }
`;

export const TableBodyCell = styled.td`
  ${props => onClickStyle(props)} ${props => truncateStyle(props)} ${cellStyle};
`;
