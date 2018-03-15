import { borderRadius, gridSize, colors } from '@atlaskit/theme';

import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const akGridSize = gridSize();

const css = serializeStyle({
  'background-color': colors.N20,
  'border-radius': `${borderRadius()}px`,
  margin: `${akGridSize}px 0`,
  padding: `${akGridSize}px ${akGridSize}px`,
  'box-sizing': 'border-box',
});

export default function decisionItem({ text }: NodeSerializerOpts) {
  if (!text) {
    return '';
  }

  return createTag('div', { style: css }, text);
}
