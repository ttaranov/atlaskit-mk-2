import { akColorN30A } from '@atlaskit/util-shared-styles';
import { createTag, serializeStyle } from '../util';

const css = serializeStyle({
  border: 'none',
  'border-bottom': `1px solid ${akColorN30A}`,
});

export default function rule() {
  return createTag('hr', { style: css });
}
