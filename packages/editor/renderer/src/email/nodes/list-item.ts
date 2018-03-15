import { createTag } from '../util';
import { NodeSerializerOpts } from '../interfaces';

export default function listItem({ text }: NodeSerializerOpts) {
  return createTag('li', {}, text);
}
