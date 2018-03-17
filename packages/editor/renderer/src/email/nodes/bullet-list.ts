import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const getStyle = indentLevel =>
  serializeStyle({
    'list-style-type': 'disc',
    'margin-left': (indentLevel || 0) * 20,
  });

export default function bulletList({ attrs, text }: NodeSerializerOpts) {
  return createTag('ul', { style: getStyle(attrs.indentLevel) }, text);
}
