import styled from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';

export const Body = styled.div`
  padding: 40px 20px;
  text-align: center;
`;

// TODO: equivilant to H600, need to replace with mixin when available from
// the @atlaskit/theme package
export const Heading = styled.h4`
  color: inherit;
  font-size: 20px;
  font-style: inherit;
  font-weight: 500;
  letter-spacing: -0.008em;
  line-height: 1.2;
  margin-bottom: ${gridSize}px;
`;

export const Image = styled.img`
  height: auto;
  max-width: 100%;
`;
export const Actions = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 40px 40px;
`;
export const ActionItem = styled.div`
  margin: 0 ${math.divide(gridSize, 2)}px;
`;
