import styled, { css } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ReactNode, ComponentClass } from 'react';
import { akColorN10, akBorderRadius } from '@atlaskit/util-shared-styles';

export const Container: ComponentClass<
  HTMLAttributes<{}> & { height?: number }
> = styled.div`
  border-radius: ${akBorderRadius};

  /** Taken from the style of inline dialog components */
  box-shadow: 0 0 1px rgba(9, 30, 66, 0.31),
    0 4px 8px -2px rgba(9, 30, 66, 0.25);

  display: flex;
  align-items: center;
  padding: 4px 8px 4px 4px;
  background-color: ${akColorN10};
  ${({ height }: { height: number | undefined }) =>
    height
      ? css`
          height: ${height}px;
        `
      : ''};
`;
