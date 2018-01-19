// @flow
import styled from 'styled-components';
import { onClickStyle, truncateStyle, cellStyle } from './constants';

export const TableBodyCell = styled.td`
  ${props => onClickStyle(props)} ${props => truncateStyle(props)} ${cellStyle};
`;
