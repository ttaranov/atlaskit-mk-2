import {
  sanitizeSearchQuery,
  ShownAnalyticsAttributes,
  DEFAULT_GAS_CHANNEL,
  DEFAULT_GAS_ATTRIBUTES,
  DEFAULT_GAS_SOURCE,
} from './analytics-util';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import { CreateAnalyticsEventFn } from '../components/analytics/types';

export function firePreQueryShownEvent(
  eventAttributes: ShownAnalyticsAttributes,
  elapsedMs: number,
  searchSessionId: string,
  createAnalyticsEvent: CreateAnalyticsEventFn,
) {
  if (createAnalyticsEvent) {
    const event = createAnalyticsEvent();
    const payload: GasPayload = {
      action: 'shown',
      actionSubject: 'searchResults',
      actionSubjectId: 'preQuerySearchResults',
      eventType: 'ui',
      source: DEFAULT_GAS_SOURCE,
      attributes: {
        preQueryRequestDurationMs: elapsedMs,
        searchSessionId: searchSessionId,
        ...eventAttributes,
        ...DEFAULT_GAS_ATTRIBUTES,
      },
    };
    event.update(payload).fire(DEFAULT_GAS_CHANNEL);
  }
}

export function firePostQueryShownEvent(
  resultsDetails: ShownAnalyticsAttributes,
  elapsedMs: number,
  searchSessionId: string,
  query: string,
  createAnalyticsEvent: CreateAnalyticsEventFn,
) {
  const event = createAnalyticsEvent();
  const sanitizedQuery = sanitizeSearchQuery(query);

  const payload: GasPayload = {
    action: 'shown',
    actionSubject: 'searchResults',
    actionSubjectId: 'postQuerySearchResults',
    eventType: 'ui',
    source: DEFAULT_GAS_SOURCE,
    attributes: {
      queryCharacterCount: sanitizedQuery.length,
      queryWordCount:
        sanitizedQuery.length > 0 ? sanitizedQuery.split(/\s/).length : 0,
      postQueryRequestDurationMs: elapsedMs,
      searchSessionId: searchSessionId,
      ...resultsDetails,
      ...DEFAULT_GAS_ATTRIBUTES,
    },
  };
  event.update(payload).fire(DEFAULT_GAS_CHANNEL);
}
