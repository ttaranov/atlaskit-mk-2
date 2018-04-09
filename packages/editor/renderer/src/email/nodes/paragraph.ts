import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const getStyle = indentLevel =>
  serializeStyle({
    'white-space': 'pre-wrap',
    'word-wrap': 'break-word',
    'margin-left': `${(indentLevel || 0) * 30}px`,
  });

export default function paragraph({ attrs, text }: NodeSerializerOpts) {
  const css = getStyle(attrs.indentLevel);
  return createTag('p', { style: css }, text);
}
