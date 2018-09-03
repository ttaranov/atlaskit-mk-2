// @flow

import { colors, gridSize } from '@atlaskit/theme';
import type { ModeColors } from '../../theme/types';

const fontSize = 11;

const baseStyles = {
  headingBase: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    fontSize: `${fontSize}px`,
    fontWeight: 600,
    lineHeight: gridSize() * 2 / fontSize,
    margin: `${gridSize() * 2.5}px 0 ${gridSize()}px`,
    padding: `0 ${gridSize() / 2}px`,
    textTransform: 'uppercase',
  },
  textWrapper: {
    flexGrow: 1,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  },
  afterWrapper: {
    lineHeight: 1,
    marginLeft: `${gridSize() / 2}px`,
  },
};

export default ({ product }: ModeColors) => () => ({
  container: {
    ...baseStyles,
    headingBase: { ...baseStyles.headingBase, color: colors.N200 },
  },
  product: {
    ...baseStyles,
    headingBase: { ...baseStyles.headingBase, color: product.text.alternate },
  },
});
