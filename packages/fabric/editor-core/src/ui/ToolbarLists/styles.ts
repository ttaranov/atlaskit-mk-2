import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { akGridSizeUnitless, akColorN30 } from '@atlaskit/util-shared-styles';

export const ButtonGroup: ComponentClass<
  HTMLAttributes<{}> & { width?: 'small' | 'large' }
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

export const Separator: ComponentClass<HTMLAttributes<{}>> = styled.span`
  background: ${akColorN30};
  width: 1px;
  height: 24px;
  display: inline-block;
  margin: 0 8px;
`;

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: flex;
  align-items: center;
  > div > div {
    display: flex;
  }
`;

export const ExpandIconWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin-left: -8px;
`;
