import { HTMLAttributes, ComponentClass } from 'react';
import styled from 'styled-components';
import UiToolbarButton, {
  Props as UiToolbarButtonProps,
} from '../../../ui/ToolbarButton';
import UiFloatingToolbar, {
  Props as UiFloatingToolbarProps,
} from '../../../ui/FloatingToolbar';
import UiSeparator from '../../../ui/Separator';

// `line-height: 1` to fix extra 1px height from toolbar wrapper
export const FloatingToolbar: ComponentClass<UiFloatingToolbarProps> = styled(
  UiFloatingToolbar,
)`
  max-height: 350px;
  min-height: 32px;
  height: initial;
  & > div {
    line-height: 1;
  }
  & > div > button:last-child {
    margin-right: 0;
  }
  .normal& input {
    min-width: 244px;
    margin-right: 2px;
  }
  .recent-search& {
    padding: 8px 0 0;
    input {
      padding: 0 8px 8px;
    }
  }
`;

// `a&` because `Button` uses it and it produces a more specific selector `a.xyz`
export const ToolbarButton: ComponentClass<UiToolbarButtonProps> = styled(
  UiToolbarButton,
)`
  width: 24px;
  padding: 0;
  margin: 0 2px;
  a& {
    width: 24px;
    margin: 0 2px;
  }
`;

// Need fixed height because parent has height inherit and `height: 100%` doesn't work because of that
export const Separator: ComponentClass<
  HTMLAttributes<HTMLSpanElement>
> = styled(UiSeparator)`
  margin: 2px 6px;
  height: 20px;
`;
