import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  width: 42px;
  display: flex;
  align-items: center;
  > div > div {
    display: flex;
  }
`;

export const InnerWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: flex;
  align-items: center;
  > * {
    margin-right: ${({ width }: { width: 'small' | 'large' }) =>
      width === 'large' ? 0 : akGridSizeUnitless}px;
  }
  div {
    display: flex;
  }
`;

export const ExpandIconWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin-left: -8px;
`;
