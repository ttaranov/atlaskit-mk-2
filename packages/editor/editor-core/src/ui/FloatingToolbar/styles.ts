import styled, { css } from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { akColorN0, akBorderRadius } from '@atlaskit/util-shared-styles';
import { dropShadow } from '../styles';

export const Container: ComponentClass<
  HTMLAttributes<{}> & { height?: number; innerRef?: any }
> = styled.div`
  border-radius: ${akBorderRadius};
  ${dropShadow} display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 4px 8px;
  background-color: ${akColorN0};
  ${({ height }: { height: number | undefined }) =>
    height
      ? css`
          height: ${height}px;
        `
      : ''};
`;
