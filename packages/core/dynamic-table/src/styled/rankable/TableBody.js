// @flow
import styled, { css } from 'styled-components';

const rankingStyles = css`
  display: block;
`;

export const RankableTableBody = styled.tbody`
  ${({ isRanking }) => isRanking && rankingStyles} box-sizing: border-box;
`;
