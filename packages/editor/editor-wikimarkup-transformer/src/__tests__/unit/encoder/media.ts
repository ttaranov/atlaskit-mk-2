import { defaultSchema } from '@atlaskit/editor-common';
import WikiMarkupTransformer from '../../../index';

import {
  doc,
  media,
  mediaGroup,
  mediaSingle,
} from '@atlaskit/editor-test-helpers';

describe('ADF => WikiMarkup - Media', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert mediaGroup node', () => {
    const node = doc(
      mediaGroup(
        media({ id: 'file1.txt', type: 'file', collection: 'tmp' })(),
        media({ id: 'file2.txt', type: 'file', collection: 'tmp' })(),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert mediaSingle node with no width and height to thumbnail', () => {
    const node = doc(
      mediaSingle()(
        media({ id: 'file1.txt', type: 'file', collection: 'tmp' })(),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert mediaSingle node with width and height', () => {
    const node = doc(
      mediaSingle()(
        media({
          id: 'file1.txt',
          type: 'file',
          collection: 'tmp',
          width: 100,
          height: 100,
        })(),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert external image', () => {
    const node = doc(
      mediaSingle()(
        media({
          url: 'https://www.atlassian.com/nice.jpg',
          type: 'external',
          width: 100,
          height: 100,
        })(),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});
