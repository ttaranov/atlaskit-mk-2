import { document } from './_fixtures';
import { createTestsForDocument } from './_createTestsForDocument';
import { extractBlockViewPropsFromDocument } from '../../../src/extract/block/extractBlockViewPropsFromDocument';

describe('extractBlockViewPropsFromDocument()', () => {
  createTestsForDocument(
    'document',
    document,
    extractBlockViewPropsFromDocument,
  );
});
