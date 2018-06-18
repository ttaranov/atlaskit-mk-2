import { document } from './_fixtures';
import { createTestsForDocument } from './_createTestsForDocument';
import { extractPropsFromDocument } from '../../src/extractBlockPropsFromJSONLD/extractPropsFromDocument';

describe('extractPropsFromDocument()', () => {
  createTestsForDocument('document', document, extractPropsFromDocument);
});
