// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { colors, gridSize } from '@atlaskit/theme';

// tslint:disable-next-line:variable-name
export const Placeholder = styled.span`
  margin: 0 0 0 ${gridSize() * 3}px;
  position: absolute;
  color: ${colors.N80};
  pointer-events: none;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: calc(100% - 50px);
`;
