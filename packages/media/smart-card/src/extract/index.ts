import { CardViewProps } from '../CardView';
import { extractPropsFromJSONLD } from './extractPropsFromJSONLD';
import { extractBlockViewPropsFromObject } from './block/extractBlockViewPropsFromObject';
import { extractBlockViewPropsFromDocument } from './block/extractBlockViewPropsFromDocument';
import { extractBlockViewPropsFromSpreadsheet } from './block/extractBlockViewPropsFromSpreadsheet';

const blockExtractorPrioritiesByType = {
  Object: 0,
  Document: 5,
  Spreadsheet: 10,
};

const blockExtractorFunctionsByType = {
  Object: extractBlockViewPropsFromObject,
  Document: extractBlockViewPropsFromDocument,
  Spreadsheet: extractBlockViewPropsFromSpreadsheet,
};

export function extractBlockViewPropsFromJSONLD(json: any): CardViewProps {
  return extractPropsFromJSONLD({
    extractorPrioritiesByType: blockExtractorPrioritiesByType,
    extractorFunctionsByType: blockExtractorFunctionsByType,
    defaultExtractorFunction: extractBlockViewPropsFromObject,
    json,
  });
}
