import { expect } from 'chai';
import { createRandomADFGenerator } from '../../src';

describe('@atlaskit/editor-core/test-helper adf-schema-generator', () => {
  describe('createRandomADFGenerator', () => {
    let generator;

    beforeEach(async () => {
      if (!generator) {
        generator = await createRandomADFGenerator();
      }
    });

    for (let i = 0; i < 100; i++) {
      it(`should generate a valid ADF document: try ${i} of 1000`, () => {
        const { value: document } = generator.next();
        expect(document.version).to.eq(1);
        expect(document.type).to.eq('doc');
        expect(document.content)
          .to.be.an('array')
          .that.has.length.above(0);
      });
    }
  });
});
