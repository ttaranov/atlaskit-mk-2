import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const css = serializeStyle({
  background: 'rgba(9, 30, 66, 0.08)',
  border: '1px solid transparent',
  'border-radius': '20px',
  color: '#42526E',
  padding: '0 4px 2px 3px',
  'white-space': 'nowrap',
});

export default function mention({ text }: NodeSerializerOpts) {
  return createTag('span', { style: css }, text);
}
