//@flow
import styled from 'styled-components';
import { gridSize, colors } from '@atlaskit/theme';

export const ScoreContainer = styled.section`
  display: flex;
  align-items: center;
`;

export const Scale = styled.span`
  padding: 0 ${gridSize()}px;
  font-size: 12px;
  color: ${colors.subtleText};
`;

export const Comment = styled.div`
  margin-bottom: ${gridSize()}px;
`;
