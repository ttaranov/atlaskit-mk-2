import { NodeSerializerOpts } from '../interfaces';
import { createTag, serializeStyle } from '../util';

const css = serializeStyle({
  background: 'rgb(244, 245, 247)',
  'border-radius': '3px',
  color: 'rgb(23, 43, 77)',
  display: 'block',
  'font-size': '12px',
  'line-height': '20px',
  padding: '8px 16px',
  'white-space': 'pre',
});

export default function codeBlock({ attrs, text }: NodeSerializerOpts) {
  return createTag('code', { style: css }, text);
}
