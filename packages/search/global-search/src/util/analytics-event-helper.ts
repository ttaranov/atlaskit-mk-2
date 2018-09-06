import * as Rusha from 'rusha';
import {
  sanitizeSearchQuery,
  sanitizeContainerId,
  ShownAnalyticsAttributes,
  PerformanceTiming,
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
  nonPrivacySafeAttributes?: object | null,
): void => {
  if (createAnalyticsEvent) {
    const event = createAnalyticsEvent();
    const payload: GasPayload = {
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
    if (nonPrivacySafeAttributes) {
      payload.nonPrivacySafeAttributes = nonPrivacySafeAttributes;
    }
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

export function fireExperimentExposureEvent(
  experimentData: string | object,
  searchSessionId: string,
  createAnalyticsEvent: CreateAnalyticsEventFn,
) {
  const experimentDetails =
    typeof experimentData === 'object'
      ? { abTest: experimentData }
      : { experimentId: experimentData };
  fireGasEvent(
    createAnalyticsEvent,
    'exposed',
    'quickSearchExperiment',
    '',
    'operational',
    {
      searchSessionId,
      ...experimentDetails,
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

const getNonPrivacySafeAttributes = query => {
  return {
    query: sanitizeSearchQuery(query),
  };
};

export function fireTextEnteredEvent(
  query: string,
  searchSessionId: string,
  queryVersion: number,
  isSendSearchTermsEnabled?: boolean,
  createAnalyticsEvent?: CreateAnalyticsEventFn,
) {
  fireGasEvent(
    createAnalyticsEvent,
    'entered',
    'text',
    'globalSearchInputBar',
    'track',
    {
      queryId: null,
      queryVersion: queryVersion,
      ...getQueryAttributes(query),
      searchSessionId: searchSessionId,
    },
    isSendSearchTermsEnabled ? getNonPrivacySafeAttributes(query) : undefined,
  );
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
  timings: PerformanceTiming,
  searchSessionId: string,
  query: string,
  createAnalyticsEvent: CreateAnalyticsEventFn,
) {
  const event = createAnalyticsEvent();

  const { elapsedMs, ...otherPerformanceTimings } = timings;
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
      ...otherPerformanceTimings,
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
  containerId: sanitizeContainerId(eventData.containerId),
  resultCount: eventData.resultCount,
  experimentId: eventData.experimentId,
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
  containerId?: string;
  resultCount?: string;
  experimentId?: string;
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
  trigger?: string;
  isLoading: boolean;
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

/**
 * checks if advanced link is clicked on no result screen
 * @param eventData
 */
const checkOnNoResultScreen = eventData => {
  const index = eventData.index || 0;
  const sectionIndex = eventData.sectionIndex || 0;
  const resultCount = eventData.resultCount || 0;
  // no result screen if results count is 2 (2 advanced confluence search and advanced people search)
  // or when index = 0 and section index is 1 => empty first section
  return +!index === 0 && (+sectionIndex === 1 || +resultCount === 2);
};

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
      isLoading: eventData.isLoading,
      ...getQueryAttributes(query),
      wasOnNoResultsScreen: checkOnNoResultScreen(eventData),
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
