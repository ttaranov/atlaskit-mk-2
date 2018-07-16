import { CardViewProps } from '../CardView';
import { genericExtractPropsFromJSONLD } from '../../genericExtractPropsFromJSONLD';
import { extractPropsFromObject } from './extractPropsFromObject';
import { extractPropsFromDocument } from './extractPropsFromDocument';
import { extractPropsFromSpreadsheet } from './extractPropsFromSpreadsheet';

const blockExtractorPrioritiesByType = {
  Object: 0,
  Document: 5,
  Spreadsheet: 10,
};

const blockExtractorFunctionsByType = {
  Object: extractPropsFromObject,
  Document: extractPropsFromDocument,
  Spreadsheet: extractPropsFromSpreadsheet,
};

export function extractPropsFromJSONLD(json: any): CardViewProps {
  return genericExtractPropsFromJSONLD({
    extractorPrioritiesByType: blockExtractorPrioritiesByType,
    extractorFunctionsByType: blockExtractorFunctionsByType,
    defaultExtractorFunction: extractPropsFromObject,
    json,
  });
}
