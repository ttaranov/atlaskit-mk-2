const CommonEventData = {
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

export const GlobalSearchDrawerEvent = {
  payload: {
    action: 'viewed',
    actionSubject: 'globalSearchDrawer',
    eventType: 'screen',
    source: 'globalSearchDrawer',
    name: 'globalSearchDrawer',
    attributes: {
      subscreen: 'GlobalSearchPreQueryDrawer',
      timesViewed: 1,
      searchSessionId: expect.any(String),
      currentContentId: '123',
      searchReferrerId: '123',
      packageName: 'global-search',
      packageVersion: '0.0.0',
      componentName: 'GlobalQuickSearch',
    },
  },
  ...CommonEventData,
};

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
export const PreQuerySearchResultsEvent = sections => ({
  payload: {
    action: 'shown',
    actionSubject: 'searchResults',
    actionSubjectId: 'preQuerySearchResults',
    eventType: 'ui',
    source: 'globalSearchDrawer',
    attributes: {
      preQueryRequestDurationMs: expect.any(Number),
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
  ...CommonEventData,
});
