import styled from 'styled-components';
import { HTMLAttributes, ComponentType } from 'react';
import { gridSize, colors } from '@atlaskit/theme';

const akGridSize = gridSize();

export const Footer: ComponentType<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-bottom: ${akGridSize}px;
`;

export const TimePickerWrapper: ComponentType<HTMLAttributes<{}>> = styled.div`
  flex-grow: 1;
  margin-right: ${akGridSize}px;
`;

export const DateLabel: ComponentType<HTMLAttributes<{}>> = styled.div`
  color: ${colors.N200};
  margin-bottom: ${akGridSize}px;
  font-size: 12px;
  font-weight: 500;
`;
