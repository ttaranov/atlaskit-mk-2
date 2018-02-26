// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { gridSize } from '@atlaskit/theme';

export interface EditorIconWrapperProps {
  color: string;
}

// tslint:disable-next-line:variable-name
export const EditorIconWrapper = styled.span`
  flex: 0 0 16px;
  height: 16px;
  width: 16px;
  color: ${(props: EditorIconWrapperProps) => props.color || 'inherit'};
  margin: 2px ${gridSize}px 0 0;

  > span {
    margin: -8px;
  }
`;
