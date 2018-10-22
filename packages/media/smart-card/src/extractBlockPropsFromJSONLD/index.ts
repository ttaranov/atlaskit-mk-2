import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import { genericExtractPropsFromJSONLD } from '../genericExtractPropsFromJSONLD';
import { extractPropsFromObject } from './extractPropsFromObject';
import { extractPropsFromDocument } from './extractPropsFromDocument';
import { extractPropsFromSpreadsheet } from './extractPropsFromSpreadsheet';

const extractorPrioritiesByType = {
  Object: 0,
  Document: 5,
  'schema:TextDigitalDocument': 10,
  'schema:SpreadsheetDigitalDocument': 10,
  Spreadsheet: 10,
};

const extractorFunctionsByType = {
  Object: extractPropsFromObject,
  'schema:TextDigitalDocument': extractPropsFromDocument,
  'schema:SpreadsheetDigitalDocument': extractPropsFromSpreadsheet,
  Document: extractPropsFromDocument,
  Spreadsheet: extractPropsFromSpreadsheet,
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

/**
 *
 *
 *                AS:          Object
 *                AS:          Object -> Document
 *                Schema.org:  CreativeArt -> DigitalDocument -> SpreadsheetDigitalDocument
 *                Schema.org:  CreativeArt -> DigitalDocument -> TextDigitalDocument
 *                Schema.org:  CreativeArt -> DigitalDocument -> ....
 *
 *
 *   PDF FILE: @type: [ Document, DigitalDocument ]
 *   PDF FILE: @type: [ DigitalDocument, Document ]
 *
 *
 *
 *
 *
 */
