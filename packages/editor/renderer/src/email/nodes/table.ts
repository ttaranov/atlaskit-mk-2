import { akColorN50 } from '@atlaskit/util-shared-styles';
import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const css = serializeStyle({
  border: `1px solid ${akColorN50}`,
  'border-collapse': 'collapse',
  margin: '20px 8px',
  width: 'auto',
});

export default function table({ text }: NodeSerializerOpts) {
  return createTag('table', { style: css }, text);
}
