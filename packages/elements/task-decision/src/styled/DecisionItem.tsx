import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { gridSize } from '@atlaskit/theme';

export interface EditorIconWrapperProps {
  color?: string;
}

// tslint:disable-next-line:variable-name
export const EditorIconWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.span`
  flex: 0 0 16px;
  height: 16px;
  width: 16px;
  color: ${(props: EditorIconWrapperProps) => props.color || 'inherit'};
  margin: 2px ${gridSize}px 0 0;

  > span {
    margin: -8px;
  }
`;
