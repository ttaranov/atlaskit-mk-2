import { createTag, serializeStyle } from '../util';
import { MarkSerializerOpts } from '../interfaces';

const css = serializeStyle({
  'font-weight': 'bold',
});

export default function strong({ mark, text }: MarkSerializerOpts) {
  return createTag('span', { style: css }, text);
}
