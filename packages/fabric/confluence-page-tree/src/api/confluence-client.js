const getChildPages = (contentId, start = 1, limit = 200) => {
  const url = `/wiki/rest/api/content/${contentId}/child/page?limit=${
    limit
  }&start=${start}&expand=container,childTypes.page`;

  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  }).then(response => response.json());
};

const getPageAttributes = (contentIds, attributes, limit = 200) => {
  const contentIdParam = `id in (${contentIds})`;
  const url = `/wiki/rest/api/content/search?cql=${encodeURIComponent(
    contentIdParam,
  )}&limit=${limit}&expand=${attributes}`;

  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  }).then(response => response.json());
};

const mergePageDetails = ([pageList, pageAttributes]) => {
  return pageList.map(page => {
    const { history = {} } = pageAttributes.find(
      pageAttribute => pageAttribute.id === page.id,
    );
    const { lastUpdated, contributors } = history;

    return {
      id: page.id,
      hasChildren: page.childTypes.page.value,
      content: {
        ...page,
        lastUpdated,
        contributors,
      },
    };
  });
};

const extractContentIdsAndGetPageAttributes = (pages, attributes, limit) => {
  const childPageIds = pages.map(childPage => childPage.id);

  return getPageAttributes(childPageIds, attributes, limit).then(
    ({ results: pageDetails }) => [pages, pageDetails],
  );
};

const getChildPageDetails = (
  contentId,
  start = 1,
  limit = 200,
  attributes = 'history.contributors.publishers.users,history.lastUpdated',
) => {
  //TODO: Add error handling
  return getChildPages(contentId, start, limit)
    .then(({ results: childPages }) =>
      extractContentIdsAndGetPageAttributes(childPages, attributes, limit),
    )
    .then(mergePageDetails);
};

export { getChildPageDetails };
