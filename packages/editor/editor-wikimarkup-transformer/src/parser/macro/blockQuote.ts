import { colors } from '@atlaskit/theme';
import { Node as PMNode, Schema } from 'prosemirror-model';
import { parseString } from '../text';
import { normalizePMNodes } from '../utils/normalize';
import { TokenErrCallback } from '../tokenize';

export function blockquoteMacro(
  attrs: { [key: string]: string },
  rawContent: string,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): PMNode[] {
  if (!rawContent.length) {
    const empty = emptyBlockquote(schema);
    return [empty];
  }
  const content = parseString(rawContent, schema, undefined, tokenErrCallback);
  const normalizedContent = normalizePMNodes(content, schema);
  return sanitize(normalizedContent, schema);
}

function emptyBlockquote(schema: Schema) {
  const p = schema.nodes.paragraph.createChecked({}, []);
  return schema.nodes.blockquote.createChecked({}, p);
}

function sanitize(nodes: PMNode[], schema: Schema) {
  const output: PMNode[] = [];
  let contentBuffer: PMNode[] = [];

  for (const n of nodes) {
    switch (n.type.name) {
      case 'paragraph': {
        /**
         * blockquote is happy with paragraph
         */
        contentBuffer.push(n);
        break;
      }
      case 'heading': {
        /**
         * If a heading is inside a list item
         * - h1. Bold, Uppercase
         * - h2. Bold, Italic
         * - h3. Bold
         * - h4. Bold, Grey
         * - h5. Grey, Italic
         * - h6. Grey
         */
        contentBuffer.push(transformHeading(n, schema));
        break;
      }
      default:
        /**
         * Anything else should be lifted
         */
        if (contentBuffer.length) {
          const blockquote = schema.nodes.blockquote.createChecked(
            {},
            contentBuffer,
          );
          output.push(blockquote);
          contentBuffer = [];
        }
        output.push(n);
    }
  }
  if (contentBuffer.length) {
    const blockquote = schema.nodes.blockquote.createChecked({}, contentBuffer);
    output.push(blockquote);
  }
  return output;
}

function transformHeading(heading: PMNode, schema: Schema): PMNode {
  const contentBuffer: PMNode[] = [];
  heading.content.forEach(n => {
    const strong = schema.marks.strong.create();
    const italic = schema.marks.em.create();
    const grey = schema.marks.textColor.create({ color: colors.N80 });

    if (n.type.name === 'text') {
      if (n.text && heading.attrs.level === 1) {
        n.text = n.text.toUpperCase();
      }
      if (heading.attrs.level <= 4) {
        n = n.mark([...n.marks, strong]);
      }
      if (heading.attrs.level === 5 || heading.attrs.level === 2) {
        n = n.mark([...n.marks, italic]);
      }
      if (heading.attrs.level > 3) {
        n = n.mark([...n.marks, grey]);
      }
    }
    contentBuffer.push(n);
  });
  return schema.nodes.paragraph.createChecked({}, contentBuffer);
}
