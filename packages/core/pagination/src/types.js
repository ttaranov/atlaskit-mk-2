//@flow
import type { Node } from 'react';

export type NavigatorPropsType = {
  children?: Node,
  isDisabled?: boolean,
  onClick?: Function,
  label?: string,
};
