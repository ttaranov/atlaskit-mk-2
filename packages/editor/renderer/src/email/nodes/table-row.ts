import { createTag } from '../util';
import { NodeSerializerOpts } from '../interfaces';

export default function tableRow({ text }: NodeSerializerOpts) {
  return createTag('tr', {}, text);
}
