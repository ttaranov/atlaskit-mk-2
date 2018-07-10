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

export type KeyboardControlEvent = {
  resultId: string;
  type: string;
  contentType: string;
  sectionIndex: string;
  index: string;
  indexWithinSection: string;
  key;
};

export type SelectedSearchResultEventData = {
  resultId: string;
  type: string;
  contentType: string;
  sectionIndex: string;
  index: string;
  indexWithinSection: string;
  method;
  newTab;
};

export type AnalyticsNextEvent = {
  payload: GasPayload;
  context: Array<any>;
  update: (GasPayload) => AnalyticsNextEvent;
  fire: (string) => AnalyticsNextEvent;
};

export function fireSelectedSearchResult(
  eventData: SelectedSearchResultEventData,
  searchSessionId: string,
  createAnalyticsEvent: CreateAnalyticsEventFn,
) {
  const {
    method,
    newTab,
    resultId,
    type,
    contentType,
    sectionIndex,
    index,
    indexWithinSection,
  } = eventData;
  const event = createAnalyticsEvent();
  const payload: GasPayload = {
    action: 'selected',
    actionSubject: 'navigationItem',
    actionSubjectId: 'searchResult',
    eventType: 'track',
    source: DEFAULT_GAS_SOURCE,
    attributes: {
      trigger: method,
      searchSessionId: searchSessionId,
      resultContentId: resultId,
      type: contentType,
      sectionId: type,
      sectionIndex,
      globalIndex: index,
      indexWithinSection,
      newTab,
      ...DEFAULT_GAS_ATTRIBUTES,
    },
  };
  event.update(payload).fire(DEFAULT_GAS_CHANNEL);
}

export function fireHighlightedSearchResult(
  eventData: KeyboardControlEvent,
  searchSessionId: string,
  createAnalyticsEvent: CreateAnalyticsEventFn,
) {
  const {
    key,
    resultId,
    type,
    contentType,
    sectionIndex,
    index,
    indexWithinSection,
  } = eventData;
  const event = createAnalyticsEvent();
  const payload: GasPayload = {
    action: 'highlighted',
    actionSubject: 'navigationItem',
    actionSubjectId: 'searchResult',
    eventType: 'ui',
    source: DEFAULT_GAS_SOURCE,
    attributes: {
      searchSessionId: searchSessionId,
      resultContentId: resultId,
      type: contentType,
      sectionId: type,
      sectionIndex,
      globalInde: index,
      indexWithinSection,
      ...DEFAULT_GAS_ATTRIBUTES,
      key,
    },
  };
  event.update(payload).fire(DEFAULT_GAS_CHANNEL);
}
