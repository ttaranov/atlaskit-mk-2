import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { gridSize } from '@atlaskit/theme';

export const OuterContainer: ComponentClass<
  HTMLAttributes<{}> & {
    width?: 'small' | 'large';
  }
> = styled.span`
  position: relative;
  margin-right: ${({ width }: { width: 'small' | 'large' }) =>
    !width || width === 'large' ? 0 : gridSize()}px;
  > div {
    display: flex;
  }
`;
