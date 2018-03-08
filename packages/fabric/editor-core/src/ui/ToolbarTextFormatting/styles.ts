import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';

export const ButtonGroup: ComponentClass<
  HTMLAttributes<{}> & {
    width?: 'small' | 'large';
  }
> = styled.span`
  display: flex;
  align-items: center;

  & > div:not(:first-child) {
    margin-left: ${({ width }: { width: 'small' | 'large' }) =>
      width === 'large' ? 0 : akGridSizeUnitless}px;
  }

  div {
    display: flex;
  }
`;
