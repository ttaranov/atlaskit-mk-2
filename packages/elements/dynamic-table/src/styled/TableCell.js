// @flow
import styled, {css} from 'styled-components';
import { onClickStyle, truncateStyle, cellStyle } from './constants';

const draggableStyle = ({ isDraggable, isDragging, dragWidth }: { isDraggable: boolean, isDragging: boolean, dragWidth: number }) =>
isDraggable && isDragging &&
  css`
    box-sizing: border-box;
    width: ${dragWidth}px;
  `;


export const TableBodyCell = styled.td`
  ${props => onClickStyle(props)} 
  ${props => truncateStyle(props)}
  ${props => draggableStyle(props)}
  
  ${cellStyle};
`;
