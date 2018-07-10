import { document } from './_fixtures';
import { createTestsForDocument } from './_createTestsForDocument';
import { extractPropsFromDocument } from '../../../../block/extractPropsFromJSONLD/extractPropsFromDocument';

describe('extractPropsFromDocument()', () => {
  createTestsForDocument('document', document, extractPropsFromDocument);
});
