// @flow
import styled, { css } from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';

export const Table = styled.table`
  ${({ isFixedSize }) =>
    isFixedSize &&
    css`
      table-layout: fixed;
    `};
  border-collapse: collapse;
  width: 100%;
`;

export const Caption = styled.caption`
  font-size: 1.42857143em;
  will-change: transform;
  font-style: inherit;
  font-weight: 500;
  letter-spacing: -0.008em;
  line-height: 1.2;
  margin-bottom: ${gridSize}px;
  margin-top: ${math.multiply(gridSize, 3.5)}px;
  text-align: left;
`;
