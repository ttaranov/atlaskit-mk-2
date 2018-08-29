import { defaultSchema } from '@atlaskit/editor-common';
import WikiMarkupTransformer from '../../../index';

import { doc, li, ol, p, ul } from '@atlaskit/editor-test-helpers';

describe('ADF => WikiMarkup - List', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert bulletList node', () => {
    const node = doc(ul(li(p('item 1')), li(p('item 2'))))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert listItem with multiple paragraph', () => {
    const node = doc(ul(li(p('item 1A'), p('item 1B')), li(p('item 2'))))(
      defaultSchema,
    );
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert orderedList node', () => {
    const node = doc(ol(li(p('item 1')), li(p('item 2'))))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert nested orderedList inside bulletList', () => {
    const node = doc(
      ul(
        li(p('item 1'), ol(li(p('innner item 1')), li(p('innner item 2')))),
        li(p('item 2')),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert nested bulletList inside orderedList', () => {
    const node = doc(
      ol(
        li(p('item 1'), ul(li(p('innner item 1')), li(p('innner item 2')))),
        li(p('item 2')),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});
