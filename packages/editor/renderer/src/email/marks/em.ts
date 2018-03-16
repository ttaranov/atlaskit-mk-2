import { createTag, serializeStyle } from '../util';
import { MarkSerializerOpts } from '../interfaces';

const css = serializeStyle({
  'font-style': 'italic',
});

export default function em({ mark, text }: MarkSerializerOpts) {
  return createTag('span', { style: css }, text);
}
