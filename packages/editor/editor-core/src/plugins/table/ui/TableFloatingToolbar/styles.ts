import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';

export const TriggerWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
`;

export const ExpandIconWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.span`
  margin-left: -8px;
`;

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: flex;
  align-items: center;
  div {
    display: flex;
  }
`;

export const Spacer: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: flex;
  flex: 1;
  padding: 12px;
`;

export const DropdownMenuWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.span`
  & span[class*='BeforeAfterBase'] {
    margin: 0;
    width: 14px;
  }
`;
