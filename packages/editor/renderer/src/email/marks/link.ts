import { MarkSerializerOpts } from '../interfaces';
import { createTag, serializeStyle } from '../util';

const css = serializeStyle({
  border: 'none',
  background: 'transparent',
  color: '#0052cc',
});

export default function link({ mark, text }: MarkSerializerOpts) {
  const { href, title } = mark.attrs;

  return createTag(
    'a',
    {
      href,
      title,
      style: css,
    },
    text,
  );
}
