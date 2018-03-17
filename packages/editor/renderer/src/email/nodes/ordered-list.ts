import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const getStyle = indentLevel =>
  serializeStyle({
    'list-style-type': 'decimal',
    'margin-left': (indentLevel || 0) * 20,
  });

export default function orderedList({ attrs, text }: NodeSerializerOpts) {
  return createTag('ol', { style: getStyle(attrs.indentLevel) }, text);
}
