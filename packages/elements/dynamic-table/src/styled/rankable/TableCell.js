// @flow
import styled, {css} from 'styled-components';
import { TableBodyCell } from '../TableCell';

const rankableStyles = ({ isRanking }) =>
isRanking &&
  css`
    box-sizing: border-box;
  `;

export const RankableTableBodyCell = styled(TableBodyCell)`
  ${props => rankableStyles(props)}
`;

export const RankableTableBodyCellContent = styled.div`
  display: inline-block;
`;