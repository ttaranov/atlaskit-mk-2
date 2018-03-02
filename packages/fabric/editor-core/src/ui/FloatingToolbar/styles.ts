// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass, css, ThemedStyleFunction } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ReactNode } from 'react';
import { akColorN10, akBorderRadius } from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const Container = styled.div`
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
