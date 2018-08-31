import { defaultSchema } from '@atlaskit/editor-common';
import WikiMarkupTransformer from '../../../index';

import { doc, extension } from '@atlaskit/editor-test-helpers';

describe('ADF => WikiMarkup - Extension', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert extension node back to macro if it is a macro type', () => {
    const node = doc(
      extension({
        extensionKey: 'foo',
        extensionType: 'com.atlassian.jira.macro',
        text: 'string',
      })(),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert extension node to {adf} macro if it is not a macro type', () => {
    const node = doc(
      extension({
        extensionKey: 'foo',
        extensionType: 'com.atlassian.jira.things',
        text: 'string',
      })(),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});
