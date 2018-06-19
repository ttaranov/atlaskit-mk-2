import { InlineCard } from '@atlaskit/media-ui';
import { genericExtractPropsFromJSONLD } from '../genericExtractPropsFromJSONLD';
import { extractPropsFromObject } from './extractPropsFromObject';

const extractorPrioritiesByType = {
  Object: 0,
};

const extractorFunctionsByType = {
  Object: extractPropsFromObject,
};

export function extractInlinePropsFromJSONLD(
  json: any,
): InlineCard.ResolvedViewProps {
  return genericExtractPropsFromJSONLD({
    extractorPrioritiesByType: extractorPrioritiesByType,
    extractorFunctionsByType: extractorFunctionsByType,
    defaultExtractorFunction: extractPropsFromObject,
    json,
  });
}
