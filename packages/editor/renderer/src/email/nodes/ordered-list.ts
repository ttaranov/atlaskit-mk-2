import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const getStyle = indentLevel =>
  serializeStyle({
    'list-style-type': 'decimal',
    'margin-left': `${(indentLevel || 0) * 30}px`,
  });

export default function orderedList({ attrs, text }: NodeSerializerOpts) {
  const css = getStyle(attrs.indentLevel);
  return createTag('ol', { style: css }, text);
}
