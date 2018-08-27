import { defaultSchema } from '@atlaskit/editor-common';
import WikiMarkupTransformer from '../../../index';

import {
  decisionItem,
  decisionList,
  doc,
  emoji,
  p,
} from '@atlaskit/editor-test-helpers';

describe('ADF => WikiMarkup - Unknown Nodes', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert decision into {adf}', () => {
    const node = doc(decisionList()(decisionItem()('This is a decision')))(
      defaultSchema,
    );
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert custom emoji into {adf}', () => {
    const node = doc(
      p('Hello ', emoji({ id: 'wtf', shortName: ':wtf:', text: ':wtf:' })()),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});
