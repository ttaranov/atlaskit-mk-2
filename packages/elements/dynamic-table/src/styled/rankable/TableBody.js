// @flow
import styled, { css } from 'styled-components';

const rankingStyles = ({ isRanking }) =>
  isRanking &&
  css`
    display: block;
  `;

export const RankableTableBody = styled.tbody`
  ${rankingStyles} box-sizing: border-box;
`;
