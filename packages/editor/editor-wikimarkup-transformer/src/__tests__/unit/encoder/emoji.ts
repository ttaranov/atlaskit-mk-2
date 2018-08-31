import { defaultSchema } from '@atlaskit/editor-common';
import WikiMarkupTransformer from '../../../index';

import { doc, emoji, p } from '@atlaskit/editor-test-helpers';

describe('ADF => WikiMarkup - Emoji', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert emoji node', () => {
    const node = doc(
      p('Hello ', emoji({ id: '1f603', shortName: ':smiley:', text: '😃' })()),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});
