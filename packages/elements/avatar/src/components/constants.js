// @flow
import { ICON_SIZES } from '../styled/constants';

export const validIconSizes = Object.keys(ICON_SIZES);

export const propsOmittedFromClickData: string[] = [
  'onBlur',
  'onClick',
  'onFocus',
  'onKeyDown',
  'onKeyUp',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseUp',
];
