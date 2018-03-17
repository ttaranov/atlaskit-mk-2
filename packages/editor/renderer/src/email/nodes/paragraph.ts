import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const getStyle = indentLevel =>
  serializeStyle({
    'white-space': 'pre-wrap',
    'word-wrap': 'break-word',
    'margin-left': (indentLevel || 0) * 20,
  });

export default function paragraph({ attrs, text }: NodeSerializerOpts) {
  return createTag('p', { style: getStyle(attrs.indentLevel) }, text);
}
