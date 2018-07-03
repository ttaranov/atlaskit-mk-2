import { spreadsheet } from './_fixtures';
import { createTestsForSpreadsheet } from './_createTestsForSpreadsheet';
import { extractPropsFromSpreadsheet } from '../../../../block/extractPropsFromJSONLD/extractPropsFromSpreadsheet';

describe('extractPropsFromSpreadsheet()', () => {
  createTestsForSpreadsheet(
    'spreadsheet',
    spreadsheet,
    extractPropsFromSpreadsheet,
  );
});
