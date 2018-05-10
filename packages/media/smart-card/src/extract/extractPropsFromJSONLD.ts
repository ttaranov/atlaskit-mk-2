import { CardViewProps } from '../CardView';

export interface ExtractorFunction {
  (json: any): CardViewProps;
}

export interface ExtractOptions {
  defaultExtractorFunction: ExtractorFunction;
  extractorPrioritiesByType: { [type: string]: number };
  extractorFunctionsByType: { [type: string]: ExtractorFunction };
  json: any;
}

export function extractPropsFromJSONLD(options: ExtractOptions): CardViewProps {
  const {
    defaultExtractorFunction,
    extractorPrioritiesByType,
    extractorFunctionsByType,
    json,
  } = options;
  const type = json['@type'];

  if (type && Array.isArray(type)) {
    let highestPriority = 0;
    let highestPriorityExtractorFunction = defaultExtractorFunction;
    for (let t of type) {
      if (extractorPrioritiesByType[t] > highestPriority) {
        highestPriority = extractorPrioritiesByType[t];
        highestPriorityExtractorFunction = extractorFunctionsByType[t];
      }
    }
    return highestPriorityExtractorFunction(json);
  }

  if (type && extractorFunctionsByType[type]) {
    return extractorFunctionsByType[type](json);
  }

  return defaultExtractorFunction(json);
}
