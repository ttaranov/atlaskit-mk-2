// @flow
import styled, { css } from 'styled-components';
import { akElevationMixins } from '@atlaskit/util-shared-styles';
import { colors } from '@atlaskit/theme';
import { TableBodyRow } from '../TableRow';

const rankingStyles = css`
  display: block;
`;

const rankingItemStyles = css`
  background-color: ${colors.N20};
  ${akElevationMixins.e500} border-radius: 2px;
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
