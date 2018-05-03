import { spreadsheet } from './_fixtures';
import { createTestsForSpreadsheet } from './_createTestsForSpreadsheet';
import { extractBlockViewPropsFromSpreadsheet } from '../../../src/extract/block/extractBlockViewPropsFromSpreadsheet';

describe('extractBlockViewPropsFromSpreadsheet()', () => {
  createTestsForSpreadsheet(
    'spreadsheet',
    spreadsheet,
    extractBlockViewPropsFromSpreadsheet,
  );
});
