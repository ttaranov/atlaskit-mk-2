import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import { genericExtractPropsFromJSONLD } from '../genericExtractPropsFromJSONLD';
import { extractPropsFromObject } from './extractPropsFromObject';
import { extractPropsFromDocument } from './extractPropsFromDocument';
import { extractPropsFromSpreadsheet } from './extractPropsFromSpreadsheet';
import { extractBlockViewPropsFromTask } from './extractPropsFromTask';

const extractorPrioritiesByType = {
  Object: 0,
  Document: 5,
  'schema:TextDigitalDocument': 10,
  'schema:SpreadsheetDigitalDocument': 10,
  Spreadsheet: 10,
  'atlassian:Task': 10,
};

const extractorFunctionsByType = {
  Object: extractPropsFromObject,
  'schema:TextDigitalDocument': extractPropsFromDocument,
  'schema:SpreadsheetDigitalDocument': extractPropsFromSpreadsheet,
  Document: extractPropsFromDocument,
  Spreadsheet: extractPropsFromSpreadsheet,
  'atlassian:Task': extractBlockViewPropsFromTask,
};

export function extractBlockPropsFromJSONLD(
  json: any,
): BlockCardResolvedViewProps {
  return genericExtractPropsFromJSONLD({
    extractorPrioritiesByType: extractorPrioritiesByType,
    extractorFunctionsByType: extractorFunctionsByType,
    defaultExtractorFunction: extractPropsFromObject,
    json,
  });
}
