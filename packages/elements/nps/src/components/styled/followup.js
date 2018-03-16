//@flow
import styled from 'styled-components';
import { gridSize, colors, fontSize } from '@atlaskit/theme';

export const Contact = styled.div`
  margin-top: ${gridSize() * 2}px;
`;

export const RoleQuestion = styled.div`
  font-size: ${fontSize}px;
  color: ${colors.text};
`;
