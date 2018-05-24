import { ComponentClass, ButtonHTMLAttributes } from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import {
  akColorN10,
  akColorN70,
  akColorR300,
  akColorR400,
} from '@atlaskit/util-shared-styles';

import ToolbarButtonDefault from '../../../../ui/ToolbarButton';
import UiFloatingToolbar, {
  Props as FloatingToolbarProps,
} from '../../../../ui/FloatingToolbar';

export const TrashToolbarButton: ComponentClass<any> = styled(
  ToolbarButtonDefault,
)`
  width: 32px;
  margin-left: 8px;
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

export const FloatingToolbar: StyledComponentClass<
  FloatingToolbarProps,
  ButtonHTMLAttributes<{}>
> = styled(UiFloatingToolbar)`
  background: ${akColorN10};
  padding-left: 0;
`;
