import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const css = serializeStyle({
  'list-style-type': 'decimal',
});

export default function orderedList({ text }: NodeSerializerOpts) {
  return createTag('ol', { style: css }, text);
}
