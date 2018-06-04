// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
import { HTMLAttributes, ComponentClass, ButtonHTMLAttributes } from 'react';

import {
  akColorN70,
  akColorR300,
  akColorR400,
} from '@atlaskit/util-shared-styles';

import UiToolbarButton, {
  Props as ToolbarButtonProps,
} from '../../../../ui/ToolbarButton';
import UiSeparator from '../../../../ui/Separator';
export { Props } from '../../../../ui/ToolbarButton';

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

export const ToolbarButton: StyledComponentClass<
  ToolbarButtonProps,
  ButtonHTMLAttributes<{}>
> = styled(UiToolbarButton)`
  width: 24px;
  padding: 0;
  margin: 0 2px;
`;

export const ToolbarButtonWide = styled(ToolbarButton)`
  width: 40px;
`;

export const ToolbarButtonDanger = styled(ToolbarButton)`
  &:hover {
    color: ${akColorR300} !important;
  }
  &:active {
    color: ${akColorR400} !important;
  }
  &[disabled]:hover {
    color: ${akColorN70} !important;
  }
`;

export const Separator = styled(UiSeparator)`
  margin: 2px 6px;
`;
