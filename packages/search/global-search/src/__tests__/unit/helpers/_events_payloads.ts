const COMMON_EVENT_DATA = {
  clone: expect.any(Function),
  fire: expect.any(Function),
  context: expect.arrayContaining([
    {
      componentName: 'navigationSidebar',
      packageName: '@atlaskit/navigation',
      packageVersion: expect.any(String),
    },
  ]),
};

export function validateEvent(actual, expected) {
  expect(actual).toMatchObject(expected);
}

export const getGlobalSearchDrawerEvent = ({ subscreen, timesViewed }) => ({
  payload: {
    action: 'viewed',
    actionSubject: 'globalSearchDrawer',
    eventType: 'screen',
    source: 'globalSearchDrawer',
    name: 'globalSearchDrawer',
    attributes: {
      subscreen,
      timesViewed,
      searchSessionId: expect.any(String),
      currentContentId: '123',
      searchReferrerId: '123',
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
    },
  },
  ...COMMON_EVENT_DATA,
});

const generateResults = section => {
  const arr: any[] = [];
  for (let i = 0; i < section.resultsCount; i++) {
    arr.push({
      resultContentId: expect.any(String),
      ...(section.hasContainerId
        ? {
            resultType: expect.any(String),
            containerId: expect.any(String),
          }
        : undefined),
    });
  }
  return arr;
};

const getSearchResultsEvent = (type: 'pre' | 'post', sections, timings) => ({
  payload: {
    action: 'shown',
    actionSubject: 'searchResults',
    actionSubjectId: `${type}QuerySearchResults`,
    eventType: 'ui',
    source: 'globalSearchDrawer',
    attributes: {
      [`${type}QueryRequestDurationMs`]: expect.any(Number),
      ...timings,
      searchSessionId: expect.any(String),
      resultCount: sections
        .map(section => section.resultsCount)
        .reduce((acc, value) => acc + value, 0),
      resultSectionCount: sections.length,
      resultContext: sections.map(section => ({
        sectionId: section.id,
        results: generateResults(section),
      })),
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
    },
  },
  ...COMMON_EVENT_DATA,
});
export const getPreQuerySearchResultsEvent = sections =>
  getSearchResultsEvent('pre', sections, undefined);
export const getPostQuerySearchResultsEvent = (sections, timings) =>
  getSearchResultsEvent('post', sections, timings);

export const getTextEnteredEvent = ({
  queryLength,
  queryVersion,
  wordCount,
}) => ({
  payload: {
    action: 'entered',
    actionSubject: 'text',
    actionSubjectId: 'globalSearchInputBar',
    eventType: 'track',
    source: 'globalSearchDrawer',
    attributes: {
      queryVersion,
      queryLength,
      wordCount,
      queryHash: expect.any(String),
      searchSessionId: expect.any(String),
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
    },
  },
  ...COMMON_EVENT_DATA,
});

export const getDismissedEvent = () => ({
  payload: {
    action: 'dismissed',
    actionSubject: 'globalSearchDrawer',
    actionSubjectId: '',
    eventType: 'ui',
    source: 'globalSearchDrawer',
    attributes: {
      searchSessionId: expect.any(String),
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
    },
  },
  ...COMMON_EVENT_DATA,
});

export const getHighlightEvent = ({
  key,
  indexWithinSection,
  globalIndex,
  resultCount,
  sectionIndex,
  sectionId,
  type,
}) => ({
  payload: {
    action: 'highlighted',
    actionSubject: 'navigationItem',
    actionSubjectId: 'searchResult',
    eventType: 'ui',
    source: 'globalSearchDrawer',
    attributes: {
      searchSessionId: expect.any(String),
      resultContentId: expect.any(String),
      type,
      sectionId,
      sectionIndex,
      globalIndex,
      indexWithinSection,
      containerId: expect.any(String),
      resultCount,
      key,
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
    },
  },
  ...COMMON_EVENT_DATA,
});

export const getAdvancedSearchLinkSelectedEvent = ({
  actionSubjectId,
  resultContentId,
  sectionId,
  globalIndex,
  resultCount,
}) => ({
  clone: [Function],
  payload: {
    action: 'selected',
    actionSubject: 'navigationItem',
    actionSubjectId,
    eventType: 'track',
    source: 'globalSearchDrawer',
    attributes: {
      trigger: 'click',
      searchSessionId: expect.any(String),
      newTab: true,
      queryVersion: 0,
      queryId: null,
      isLoading: false,
      queryLength: 0,
      wordCount: 0,
      queryHash: '',
      wasOnNoResultsScreen: false,
      resultContentId,
      type: undefined,
      sectionId,
      sectionIndex: undefined,
      globalIndex,
      indexWithinSection: undefined,
      containerId: '',
      resultCount,
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
    },
  },
  ...COMMON_EVENT_DATA,
});

export const getResultSelectedEvent = ({
  sectionId,
  globalIndex,
  resultCount,
  sectionIndex,
  indexWithinSection,
  newTab,
  trigger,
  type,
}) => ({
  payload: {
    action: 'selected',
    actionSubject: 'navigationItem',
    actionSubjectId: 'searchResult',
    eventType: 'track',
    source: 'globalSearchDrawer',
    attributes: {
      trigger,
      searchSessionId: expect.any(String),
      newTab,
      resultContentId: expect.any(String),
      sectionId,
      sectionIndex,
      globalIndex,
      indexWithinSection,
      containerId: expect.any(String),
      resultCount,
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
      type,
    },
  },
  ...COMMON_EVENT_DATA,
});

export const getExperimentExposureEvent = ({ searchSessionId, abTest }) => ({
  payload: {
    action: 'exposed',
    actionSubject: 'quickSearchExperiment',
    actionSubjectId: '',
    eventType: 'operational',
    source: 'globalSearchDrawer',
    attributes: {
      searchSessionId: searchSessionId,
      abTest,
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
    },
  },
  ...COMMON_EVENT_DATA,
});
