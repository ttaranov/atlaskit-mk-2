import { defaultSchema } from '@atlaskit/editor-common';
import WikiMarkupTransformer from '../../../index';

import { blockquote, doc, hardBreak, p } from '@atlaskit/editor-test-helpers';

describe('ADF => WikiMarkup => ADF - BlockQuote', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert blockquote node', () => {
    const node = doc(
      blockquote(
        p('This is a blockquote'),
        p('and it can only contain paragraphs'),
        p('a lot paragraphs'),
      ),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert blockquote node with a single paragraph with hardbreak', () => {
    const node = doc(
      blockquote(
        p(
          'This is a blockquote',
          hardBreak(),
          'with a single paragraph',
          hardBreak(),
          'and hardbreaks',
        ),
      ),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });
});
