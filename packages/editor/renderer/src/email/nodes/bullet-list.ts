import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const css = serializeStyle({
  'list-style-type': 'disc',
});

export default function bulletList({ text }: NodeSerializerOpts) {
  return createTag('ul', { style: css }, text);
}
