import { akTypographyMixins } from '@atlaskit/util-shared-styles';
import { NodeSerializerOpts } from '../interfaces';
import { createTag, serializeStyle } from '../util';

const getTypoMixin = (tagName: string) => {
  switch (tagName) {
    case 'h1':
      return akTypographyMixins.h800;
    case 'h2':
      return akTypographyMixins.h700;
    case 'h3':
      return akTypographyMixins.h600;
    case 'h4':
      return akTypographyMixins.h500;
    case 'h5':
      return akTypographyMixins.h400;
    case 'h6':
      return akTypographyMixins.h300;
    default:
      throw new Error(`Unknown tagName: ${tagName}`);
  }
};

const getStyle = indentLevel =>
  serializeStyle({
    'margin-left': (indentLevel || 0) * 20,
  });

export default function heading({ attrs, text }: NodeSerializerOpts) {
  const tagName = `h${attrs.level}`;
  const css = `${(getTypoMixin(tagName) as any).join().trim()}${getStyle(
    attrs.indentLevel,
  )}`;

  return createTag(tagName, { style: css }, text);
}
