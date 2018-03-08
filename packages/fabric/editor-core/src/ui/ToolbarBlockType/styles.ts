import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { akColorN30 } from '@atlaskit/util-shared-styles';

export const ButtonContent: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: flex;
  width: 80px;
  height: 24px;
  align-items: center;
  padding: ${(props: any) => (props.width ? 0 : '0 8px')};
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
`;

export const MenuWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: flex;
  align-items: center;
  > div > div {
    display: flex;
  }
`;

export const ExpandIconWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.span`
  margin-left: -8px;
`;
