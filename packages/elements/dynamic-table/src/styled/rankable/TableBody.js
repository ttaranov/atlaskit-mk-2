// @flow
import styled, { css } from 'styled-components';

const rankingStyles = ({ isRanking }) =>
  isRanking &&
  css`
    display: block;
  `;

export const RankableTableBody = styled.tbody`
  ${rankingStyles} cursor: ${({ isRanking }) =>
      isRanking ? 'grabbing' : 'grab'};
  box-sizing: border-box;
`;
