// @flow
import styled, { css } from 'styled-components';
import { onClickStyle } from './constants';
import { row } from '../theme';

const draggableStyle = ({ isDraggable, isDragging, isCurrentlyDragging, dragWidth }: { isDraggable: boolean, isDragging: boolean }) => {
  return isDraggable &&
  css`
    &:hover {
      
      cursor: ${isCurrentlyDragging ? "grabbing" : "grab"};

    }

    ${isDragging && dragWidth ? css`display: block; width: ${dragWidth}px;` : null}

    ${isCurrentlyDragging ? css`
      background-color: #F4F5F7;
      box-shadow: 0 8px 16px -4px rgba(9, 30, 66, 0.25);
      border: 0 0 1px rgba(9, 30, 66, 0.31);
    ` : null}
`;

}

export const TableBodyRow = styled.tr`
${props => draggableStyle(props)}
  

  &:hover {
    background: ${row.hoverBackground};
  }
`;

