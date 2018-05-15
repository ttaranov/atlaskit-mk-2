import { spreadsheet } from './_fixtures';
import { createTestsForSpreadsheet } from './_createTestsForSpreadsheet';
import { extractPropsFromSpreadsheet } from '../../../src/block/extractPropsFromJSONLD/extractPropsFromSpreadsheet';

describe('extractPropsFromSpreadsheet()', () => {
  createTestsForSpreadsheet(
    'spreadsheet',
    spreadsheet,
    extractPropsFromSpreadsheet,
  );
});
