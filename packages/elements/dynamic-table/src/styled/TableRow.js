// @flow
import styled from 'styled-components';
import { onClickStyle } from './constants';
import { row } from '../theme';

export const TableBodyRow = styled.tr`
  ${props => onClickStyle(props)} 
  
  &:hover {
    background: ${row.hoverBackground};
  }
`;