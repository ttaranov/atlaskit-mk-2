
// @flow
import styled, { css } from 'styled-components';
import { TableBodyRow } from '../TableRow';

const draggableStyle = ({ isRanking, isRankingItem, rankWidth }) => css`
  &:hover {
    cursor: ${isRankingItem ? "grabbing" : "grab"};
  }

  ${isRanking && css`
    display: block; 
    width: ${rankWidth}px;
  `}

  ${isRankingItem && css`
    background-color: #F4F5F7;
    box-shadow: 0 8px 16px -4px rgba(9, 30, 66, 0.25);
    border: 0 0 1px rgba(9, 30, 66, 0.31);
  `}
`;

export const RankableTableBodyRow = styled(TableBodyRow)`
  ${props => draggableStyle(props)}
`;

