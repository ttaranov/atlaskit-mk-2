import { colors, gridSize } from '@atlaskit/theme';

import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const css = serializeStyle({
  'border-left': `2px solid ${colors.N40}`,
  color: colors.N300,
  margin: `${gridSize() * 1.5}px 0 0 0`,
  'padding-left': `${gridSize() * 2}px`,
});

export default function blockquote({ text }: NodeSerializerOpts) {
  return createTag('blockquote', { style: css }, text);
}
