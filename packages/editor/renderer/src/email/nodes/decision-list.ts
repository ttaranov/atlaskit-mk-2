import { createTag } from '../util';
import { NodeSerializerOpts } from '../interfaces';

export default function decisionList({ text }: NodeSerializerOpts) {
  return createTag('div', {}, text);
}
