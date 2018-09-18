// @flow
import styled, { css } from 'styled-components';
import { colors, elevation } from '@atlaskit/theme';
import { TableBodyRow } from '../TableRow';

const rankingStyles = css`
  display: block;
`;

/**
 * TODO: Pass the props here to get particular theme for the table
 * Skipping it for now as it may impact migration as util-shared-styles does not support this feature
 */
const rankingItemStyles = css`
  background-color: ${colors.N20};
  ${elevation.e500()} border-radius: 2px;
`;

const draggableStyles = ({ isRanking, isRankingItem }) => css`
  ${isRanking && rankingStyles} ${isRankingItem && rankingItemStyles} &:focus {
    outline-style: solid;
    outline-color: ${colors.B100};
    outline-width: 2px;
  }
`;

export const RankableTableBodyRow = styled(TableBodyRow)`
  ${draggableStyles};
`;
