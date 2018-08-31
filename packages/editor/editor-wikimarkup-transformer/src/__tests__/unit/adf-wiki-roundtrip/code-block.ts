import { defaultSchema } from '@atlaskit/editor-common';
import WikiMarkupTransformer from '../../../index';

import { code_block, doc } from '@atlaskit/editor-test-helpers';

describe('ADF => WikiMarkup => ADF - CodeBlock', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert codeBlock node', () => {
    const node = doc(code_block({ language: 'javascript' })('const i = 0;'))(
      defaultSchema,
    );
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });
});
