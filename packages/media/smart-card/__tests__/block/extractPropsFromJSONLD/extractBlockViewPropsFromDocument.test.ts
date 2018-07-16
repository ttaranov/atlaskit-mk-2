import { document } from './_fixtures';
import { createTestsForDocument } from './_createTestsForDocument';
import { extractPropsFromDocument } from '../../../src/block/extractPropsFromJSONLD/extractPropsFromDocument';

describe('extractPropsFromDocument()', () => {
  createTestsForDocument('document', document, extractPropsFromDocument);
});
