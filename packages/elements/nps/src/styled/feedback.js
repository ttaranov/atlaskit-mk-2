//@flow
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';

export const ScoreContainer = styled.section`
  display: flex;
  align-items: center;
`;

export const Scale = styled.div`
  padding: 0 ${gridSize()}px;
`;

export const Comment = styled.div`
  margin-bottom: ${gridSize()}px;
`;
