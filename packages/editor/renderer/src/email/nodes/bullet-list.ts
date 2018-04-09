import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const getStyle = indentLevel =>
  serializeStyle({
    'list-style-type': 'disc',
    'margin-left': `${(indentLevel || 0) * 30}px`,
  });

export default function bulletList({ attrs, text }: NodeSerializerOpts) {
  const css = getStyle(attrs.indentLevel);
  return createTag('ul', { style: css }, text);
}
