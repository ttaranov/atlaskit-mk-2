import { BlockCard } from '@atlaskit/media-ui';
import { genericExtractPropsFromJSONLD } from '../genericExtractPropsFromJSONLD';
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

export function extractBlockPropsFromJSONLD(
  json: any,
): BlockCard.ResolvedViewProps {
  return genericExtractPropsFromJSONLD({
    extractorPrioritiesByType: blockExtractorPrioritiesByType,
    extractorFunctionsByType: blockExtractorFunctionsByType,
    defaultExtractorFunction: extractPropsFromObject,
    json,
  });
}
