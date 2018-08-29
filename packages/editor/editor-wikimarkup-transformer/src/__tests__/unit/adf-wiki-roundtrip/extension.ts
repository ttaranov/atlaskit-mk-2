import { defaultSchema } from '@atlaskit/editor-common';
import WikiMarkupTransformer from '../../../index';

import { doc, extension } from '@atlaskit/editor-test-helpers';

describe('ADF => WikiMarkup => ADF - Extension', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert extension node back to macro if it is a macro type', () => {
    const node = doc(
      extension({
        extensionKey: 'foo',
        extensionType: 'com.atlassian.jira.macro',
        text: 'string',
        parameters: {
          rawAttrs: 'a=b|c=d',
        },
      })(),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });

  test('should convert extension node to {adf} macro if it is not a macro type', () => {
    const node = doc(
      extension({
        extensionKey: 'foo',
        extensionType: 'com.atlassian.jira.things',
        text: 'string',
      })(),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });
});
