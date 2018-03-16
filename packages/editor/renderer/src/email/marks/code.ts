import { MarkSerializerOpts } from '../interfaces';
import { createTag, serializeStyle } from '../util';

const css = serializeStyle({
  background: 'rgb(244, 245, 247)',
  color: 'rgb(23, 43, 77)',
  'border-radius': '3px',
  padding: '2px 4px',
});

export default function code({ mark, text }: MarkSerializerOpts) {
  return createTag('code', { style: css }, text);
}
