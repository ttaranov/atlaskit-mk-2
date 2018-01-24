// @flow
import styled, { css } from 'styled-components';
import { akElevationMixins } from '@atlaskit/util-shared-styles';
import { colors } from '@atlaskit/theme';
import { TableBodyRow } from '../TableRow';

const draggableStyle = ({ isRanking, isRankingItem }) => css`
  ${isRanking &&
    css`
      display: block;
    `} &:focus {
    outline-style: solid;
    outline-color: ${colors.B100};
    outline-width: 2px;
  }

  ${isRankingItem &&
    css`
      background-color: ${colors.N20};
      ${akElevationMixins.e500} border-radius: 2px;
    `};
`;

export const RankableTableBodyRow = styled(TableBodyRow)`
  ${props => draggableStyle(props)};
`;
