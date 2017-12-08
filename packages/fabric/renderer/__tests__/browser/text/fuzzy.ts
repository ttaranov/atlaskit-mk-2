import { TextSerializer } from '../../../src';
import { createRandomADFGenerator } from '@atlaskit/editor-test-helpers';
import { defaultSchema as schema } from '@atlaskit/editor-common';

const serializer = TextSerializer.fromSchema(schema);

const render = (doc: any) => {
  const docFromSchema = schema.nodeFromJSON(doc);
  return serializer.serializeFragment(docFromSchema.content);
};

describe('Renderer - TextSerializer - Fuzzing', () => {
  let generator;
  beforeAll(async () => {
    generator = await createRandomADFGenerator();
  })

  for (let i = 0, LIMIT = 1000; i < LIMIT; i++) {
    it(`should return a string from a random document: ${i} of ${LIMIT}`, () => {
      const { value: document } = generator.next();
      expect(typeof render(document)).toBe('string')
    });
  }
});