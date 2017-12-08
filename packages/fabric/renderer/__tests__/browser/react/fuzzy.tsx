import { mount } from 'enzyme';
import { createRandomADFGenerator } from '@atlaskit/editor-test-helpers';
import { ReactSerializer } from '../../../src';
import { defaultSchema as schema } from '@atlaskit/editor-common';
import { Action } from '../../../src/react/marks';

describe('Renderer - TextSerializer - Fuzzing', () => {
  let generator;
  let reactSerializer;
  beforeAll(async () => {
    generator = await createRandomADFGenerator();
    reactSerializer = ReactSerializer.fromSchema(schema, {});;
  })

  for (let i = 0, LIMIT = 1000; i < LIMIT; i++) {
    it(`should return a string from a random document: ${i} of ${LIMIT}`, () => {
      const { value: document } = generator.next();

      const docFromSchema = schema.nodeFromJSON(document);

      let reactDoc;
      expect(() => (
        reactDoc = mount(reactSerializer.serializeFragment(docFromSchema.content))
      )).not.toThrow();
      reactDoc.unmount();
    });
  }
});