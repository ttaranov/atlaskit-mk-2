// @flow
import styled, { css } from 'styled-components';

const rankingStyles = ({isRanking, width}) => isRanking && css`
  display: block;
  width: ${width}px;
`;

export const RankableTableBody = styled.tbody`
  ${rankingStyles}

  cursor: ${({isRanking}) => isRanking ? "grabbing" : "grab"}
`;
