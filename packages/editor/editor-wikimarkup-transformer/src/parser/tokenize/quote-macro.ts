import { Node as PMNode, Schema } from 'prosemirror-model';
import { Token, TokenErrCallback } from '.';
import { commonMacro } from './common-macro';
import { hasAnyOfMarks } from '../utils/text';
import { normalizePMNodes } from '../utils/normalize';
import { parseString } from '../text';

export function quoteMacro(
  input: string,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): Token {
  return commonMacro(input, schema, {
    opening: /^\{quote(?::([^\{\n\}]*))?\}/,
    closing: /\{quote\}/,
    rawContentProcessor,
    tokenErrCallback,
  });
}

export const rawContentProcessor = (
  rawAttrs: string,
  rawContent: string,
  length: number,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): Token => {
  if (!rawContent.length) {
    const emptyQuote = emptyBlockquote(schema);
    return {
      type: 'pmnode',
      nodes: [emptyQuote],
      length,
    };
  }
  const parsedContent = parseString(rawContent, schema, [], tokenErrCallback);
  const normalizedContent = normalizePMNodes(parsedContent, schema);

  return {
    type: 'pmnode',
    nodes: sanitize(normalizedContent, schema),
    length,
  };
};

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
         * - h4. Bold, Gray
         * - h5. Gray, Italic
         * - h6. Gray
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
    const gray = schema.marks.textColor.create({ color: '#97a0af' });

    if (n.type.name === 'text') {
      if (n.text && heading.attrs.level === 1) {
        n.text = n.text.toUpperCase();
      }
      if (heading.attrs.level <= 4 && !hasAnyOfMarks(n, ['strong', 'code'])) {
        n = n.mark([...n.marks, strong]);
      }
      if (
        (heading.attrs.level === 5 || heading.attrs.level === 2) &&
        !hasAnyOfMarks(n, ['em', 'code'])
      ) {
        n = n.mark([...n.marks, italic]);
      }
      if (heading.attrs.level > 3 && !hasAnyOfMarks(n, ['textColor', 'code'])) {
        n = n.mark([...n.marks, gray]);
      }
    }
    contentBuffer.push(n);
  });
  return schema.nodes.paragraph.createChecked({}, contentBuffer);
}
