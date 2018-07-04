import {
  name as packageName,
  version as packageVersion,
} from '../../../../package.json';
import { GasPayload } from '@atlaskit/analytics-gas-types';

export const buildAnalyticsPayload = (
  actionSubject: string,
  action: string,
  actionSubjectId: string,
  otherAttributes = {},
): GasPayload => ({
  action,
  actionSubject,
  actionSubjectId,
  eventType: 'ui',
  attributes: {
    packageName,
    packageVersion,
    componentName: 'mention',
    ...otherAttributes,
  },
  source: 'unknown',
});

type QueryAttributes = Partial<{
  queryLength: number;
  spaceInQuery: boolean;
}>;

const emptyQueryResponse = {
  queryLength: 0,
  spaceInQuery: false,
};

const extractAttributesFromQuery = (query?: string): QueryAttributes => {
  if (query) {
    return {
      queryLength: query.length,
      spaceInQuery: query.indexOf(' ') !== -1,
    };
  }
  return emptyQueryResponse;
};

export const buildTypeAheadCancelPayload = (
  duration: number,
  upKeyCount: number,
  downKeyCount: number,
  query?: string,
): GasPayload => {
  const { queryLength, spaceInQuery } = extractAttributesFromQuery(query);
  return buildAnalyticsPayload('typeahead', 'cancelled', 'mentionTypeahead', {
    duration,
    downKeyCount,
    upKeyCount,
    queryLength,
    spaceInQuery,
  });
};
