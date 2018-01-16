import {
  getPossiblePaths,
  getSchemaNode,
  pathToText,
  checkPathInADF,
} from '../src/adf-pm-consistency-check';

describe('@atlaskit/editor-core/test-helper adf-pm-check', () => {
  describe(':', () => {
    let schema;

    beforeAll(async () => {
      schema = await getSchemaNode();
    });

    getPossiblePaths().forEach(path => {
      it(`Trying to find [${pathToText(path)}]`, () => {
        expect(checkPathInADF(path, schema)).toBe(true);
      });
    });
  });
});
