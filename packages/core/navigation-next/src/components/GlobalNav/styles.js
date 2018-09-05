// @flow

import { GLOBAL_NAV_WIDTH } from '../../common/constants';
import type { ModeColors } from '../../theme/types';

const baseStyles = {
  alignItems: 'center',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  height: '100vh',
  justifyContent: 'space-between',
  paddingBottom: 16,
  paddingTop: 16,
  transition:
    'background-color 0.3s cubic-bezier(0.2, 0, 0, 1), color 0.3s cubic-bezier(0.2, 0, 0, 1)',
  width: GLOBAL_NAV_WIDTH,
};

export default ({ product }: ModeColors) => () => ({
  ...baseStyles,
  backgroundColor: product.background.default,
  color: product.text.default,
  fill: product.background.default,
});
