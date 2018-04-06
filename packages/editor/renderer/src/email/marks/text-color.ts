import { createTag, serializeStyle } from '../util';
import { MarkSerializerOpts } from '../interfaces';

export default function textColor({ mark, text }: MarkSerializerOpts) {
  const css = serializeStyle({ color: mark.attrs.color });

  return createTag('span', { style: css }, text);
}
