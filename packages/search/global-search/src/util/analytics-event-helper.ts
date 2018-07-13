import * as Rusha from 'rusha';
import {
  sanitizeSearchQuery,
  ShownAnalyticsAttributes,
  DEFAULT_GAS_CHANNEL,
  DEFAULT_GAS_ATTRIBUTES,
  DEFAULT_GAS_SOURCE,
} from './analytics-util';
import { GasPayload, EventType } from '@atlaskit/analytics-gas-types';
import { CreateAnalyticsEventFn } from '../components/analytics/types';

const fireGasEvent = (
  createAnalyticsEvent: CreateAnalyticsEventFn | undefined,
  action: string,
  actionSubject: string,
  actionSubjectId: string,
  eventType: EventType,
  extraAtrributes: object,
): void => {
  if (createAnalyticsEvent) {
    const event = createAnalyticsEvent();
    const payload = {
      action,
      actionSubject,
      actionSubjectId,
      eventType,
      source: DEFAULT_GAS_SOURCE,
      attributes: {
        ...extraAtrributes,
        ...DEFAULT_GAS_ATTRIBUTES,
      },
    };
    event.update(payload).fire(DEFAULT_GAS_CHANNEL);
  }
};

export function firePreQueryShownEvent(
  eventAttributes: ShownAnalyticsAttributes,
  elapsedMs: number,
  searchSessionId: string,
  createAnalyticsEvent: CreateAnalyticsEventFn,
) {
  fireGasEvent(
    createAnalyticsEvent,
    'shown',
    'searchResults',
    'preQuerySearchResults',
    'ui',
    {
      preQueryRequestDurationMs: elapsedMs,
      searchSessionId: searchSessionId,
      ...eventAttributes,
    },
  );
}

const getQueryAttributes = query => {
  const sanitizedQuery = sanitizeSearchQuery(query);
  return {
    queryLength: sanitizedQuery.length,
    wordCount:
      sanitizedQuery.length > 0 ? sanitizedQuery.split(/\s/).length : 0,
    queryHash: sanitizedQuery ? hash(sanitizedQuery) : '',
  };
};

export function fireTextEnteredEvent(
  query: string,
  searchSessionId: string,
  queryVersion: number,
  createAnalyticsEvent?: CreateAnalyticsEventFn,
) {
  fireGasEvent(createAnalyticsEvent, 'entered', 'text', '', 'track', {
    queryId: null,
    queryVersion: queryVersion,
    ...getQueryAttributes(query),
    searchSessionId: searchSessionId,
  });
}

export function fireDismissedEvent(
  searchSessionId: string,
  createAnalyticsEvent?: CreateAnalyticsEventFn,
) {
  fireGasEvent(
    createAnalyticsEvent,
    'dismissed',
    'globalSearchDrawer',
    '',
    'ui',
    { searchSessionId },
  );
}
export function firePostQueryShownEvent(
  resultsDetails: ShownAnalyticsAttributes,
  elapsedMs: number,
  quickNavElapsedMs: number,
  searchSessionId: string,
  query: string,
  createAnalyticsEvent: CreateAnalyticsEventFn,
) {
  const event = createAnalyticsEvent();

  const payload: GasPayload = {
    action: 'shown',
    actionSubject: 'searchResults',
    actionSubjectId: 'postQuerySearchResults',
    eventType: 'ui',
    source: DEFAULT_GAS_SOURCE,
    attributes: {
      ...getQueryAttributes(query),
      postQueryRequestDurationMs: elapsedMs,
      searchSessionId,
      quickNavElapsedMs,
      ...resultsDetails,
      ...DEFAULT_GAS_ATTRIBUTES,
    },
  };
  event.update(payload).fire(DEFAULT_GAS_CHANNEL);
}

const transformSearchResultEventData = (eventData: SearchResultEvent) => ({
  resultContentId: eventData.resultId,
  type: eventData.contentType,
  sectionId: eventData.type,
  sectionIndex: eventData.sectionIndex,
  globalIndex: eventData.index,
  indexWithinSection: eventData.indexWithinSection,
});

const hash = (str: string): string =>
  Rusha.createHash()
    .update(str)
    .digest('hex');

export interface SearchResultEvent {
  resultId: string;
  type: string;
  contentType: string;
  sectionIndex: string;
  index: string;
  indexWithinSection: string;
}

export interface KeyboardControlEvent extends SearchResultEvent {
  key: string;
}

export interface SelectedSearchResultEvent extends SearchResultEvent {
  method: string;
  newTab: boolean;
}

export interface AdvancedSearchSelectedEvent extends SelectedSearchResultEvent {
  query: string;
  queryVersion: number;
  queryId: null | string;
  wasOnNoResultsScreen: boolean;
}

export type AnalyticsNextEvent = {
  payload: GasPayload;
  context: Array<any>;
  update: (GasPayload) => AnalyticsNextEvent;
  fire: (string) => AnalyticsNextEvent;
};

export function fireSelectedSearchResult(
  eventData: SelectedSearchResultEvent,
  searchSessionId: string,
  createAnalyticsEvent?: CreateAnalyticsEventFn,
) {
  const { method, newTab } = eventData;
  fireGasEvent(
    createAnalyticsEvent,
    'selected',
    'navigationItem',
    'searchResult',
    'track',
    {
      trigger: method,
      searchSessionId: searchSessionId,
      newTab,
      ...transformSearchResultEventData(eventData),
    },
  );
}

export function fireSelectedAdvancedSearch(
  eventData: AdvancedSearchSelectedEvent,
  searchSessionId: string,
  createAnalyticsEvent?: CreateAnalyticsEventFn,
) {
  const { method, newTab, query, queryVersion } = eventData;
  fireGasEvent(
    createAnalyticsEvent,
    'selected',
    'navigationItem',
    `advanced_${eventData.resultId}`,
    'track',
    {
      trigger: method,
      searchSessionId: searchSessionId,
      newTab,
      queryVersion,
      queryId: null,
      ...getQueryAttributes(query),
      wasOnNoResultsScreen:
        +eventData.index === 0 && +eventData.sectionIndex === 1,
      ...transformSearchResultEventData(eventData),
    },
  );
}

export function fireHighlightedSearchResult(
  eventData: KeyboardControlEvent,
  searchSessionId: string,
  createAnalyticsEvent?: CreateAnalyticsEventFn,
) {
  const { key } = eventData;
  fireGasEvent(
    createAnalyticsEvent,
    'highlighted',
    'navigationItem',
    'searchResult',
    'ui',
    {
      searchSessionId: searchSessionId,
      ...transformSearchResultEventData(eventData),
      key,
    },
  );
}
