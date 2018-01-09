// @flow
import styled, {css} from 'styled-components';
import { TableBodyCell } from '../TableCell';

const rankableStyles = ({ isRanking, rankingWidth }) =>
isRanking &&
  css`
    box-sizing: border-box;
    width: ${rankingWidth}px;
  `;

export const RankableTableBodyCell = styled(TableBodyCell)`
  ${props => rankableStyles(props)}
`;
