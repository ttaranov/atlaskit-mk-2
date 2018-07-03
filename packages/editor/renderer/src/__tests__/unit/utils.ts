import { ADFEncoder } from '../../utils';
import { defaultSchema } from '@atlaskit/editor-common';
import { doc, p, strong } from '@atlaskit/editor-test-helpers';

describe('Renderer - ADFEncoder', () => {
  let transformerProvider;
  let transformer;
  let encoder;

  beforeEach(() => {
    transformer = { encode: jest.fn(), parse: jest.fn() };
    transformerProvider = jest.fn(schema => transformer);
    encoder = new ADFEncoder(transformerProvider);
  });

  it('should pass the default schema to the transformer provider', () => {
    expect(transformerProvider).toHaveBeenCalledWith(defaultSchema);
    expect(transformerProvider).toHaveBeenCalledTimes(1);
  });

  it('should use the provided transformer to parse a given value', () => {
    transformer.parse.mockReturnValue(
      doc(p('hello ', strong('world')))(defaultSchema),
    );
    expect(encoder.encode('stubbed')).toEqual({
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'hello ' },
            { type: 'text', text: 'world', marks: [{ type: 'strong' }] },
          ],
        },
      ],
    });
  });
});
