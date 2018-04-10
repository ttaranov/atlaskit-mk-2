import { applyMarks } from '../util';
import { NodeSerializerOpts } from '../interfaces';

export default function text({ marks, text }: NodeSerializerOpts) {
  return applyMarks(marks, text!);
}
