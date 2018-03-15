import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const css = serializeStyle({
  'white-space': 'pre-wrap',
  'word-wrap': 'break-word',
});

export default function paragraph({ text }: NodeSerializerOpts) {
  return createTag('p', { style: css }, text);
}
