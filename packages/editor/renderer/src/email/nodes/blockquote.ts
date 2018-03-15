import {
  akColorN300,
  akColorN40,
  akGridSizeUnitless,
} from '@atlaskit/util-shared-styles';

import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const css = serializeStyle({
  'border-left': `2px solid ${akColorN40}`,
  color: akColorN300,
  margin: `${akGridSizeUnitless * 1.5}px 0 0 0`,
  'padding-left': `${akGridSizeUnitless * 2}px`,
});

export default function blockquote({ text }: NodeSerializerOpts) {
  return createTag('blockquote', { style: css }, text);
}
