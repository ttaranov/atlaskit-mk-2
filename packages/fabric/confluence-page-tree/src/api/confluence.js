// @flow
import type {
  PageData,
  PageAttribute,
  pageAttributesArgs,
  recursiveFetchArgs,
} from '../types';

const fetchOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
};

const recursiveFetch = ({
  currentFetch,
  terminatingFn,
  getNextFetch,
  accumulator = [],
}: recursiveFetchArgs): Promise<any> =>
  currentFetch.then(response => {
    const { results } = response;
    const finalResult = [...accumulator, ...results];

    return terminatingFn(response)
      ? Promise.resolve(finalResult)
      : recursiveFetch({
          currentFetch: getNextFetch(),
          terminatingFn,
          getNextFetch,
          accumulator: finalResult,
        });
  });

const getChildPages = (contentId: string): Promise<any> => {
  let start: number = 0;
  const limit: number = 200;

  return recursiveFetch({
    currentFetch: fetchChildPages(contentId, start),
    //terminatingFn: ({ size }) => size < limit,
    //TODO: to be removed
    terminatingFn: ({ size }) => start === 0,
    getNextFetch: () => {
      start += limit;
      return fetchChildPages(contentId, start);
    },
  });
};

const fetchChildPages = (contentId, start = 0, limit = 200): Promise<any> => {
  const path = `/wiki/rest/api/content/${contentId}/child/page`;
  const params = `limit=${limit}&start=${
    start
  }&expand=container,childTypes.page`;
  const url = `${path}?${params}`;

  return fetch(url, fetchOptions).then(response => response.json());
};

const fetchPageAttributes = ({
  contentIds,
  attributes,
  limit,
}: pageAttributesArgs): Promise<any> => {
  const path = '/wiki/rest/api/content/search';
  const cql = encodeURIComponent(`id in (${contentIds.join()})`);
  const params = `cql=${cql}&limit=${limit}&expand=${attributes}`;
  const url = `${path}?${params}`;

  return fetch(url, fetchOptions).then(response => response.json());
};

const mergePageDetails = ([pageList, pageAttributes]) =>
  pageList.map((page: PageData) => {
    const { history = {} } = pageAttributes.find(
      (pageWithAttribute: PageAttribute) => pageWithAttribute.id === page.id,
    );
    const { lastUpdated, contributors } = history;

    return {
      ...page,
      lastUpdated,
      contributors,
    };
  });

const getPageAttributes = (pages: Array<PageData>): Promise<any> => {
  let start = 0;
  const limit = 200;
  const attributes =
    'history.contributors.publishers.users,history.lastUpdated';
  const allContentIds: Array<string> = pages.map(page => page.id);
  const totalPages = allContentIds.length;
  const incrementStart = () => {
    start += limit;
  };
  const getNextPageAttributes = () => {
    incrementStart();
    const end = start + limit < totalPages ? start + limit : totalPages;
    const contentIds = allContentIds.slice(start, end);
    return fetchPageAttributes({ contentIds, attributes, limit });
  };

  const terminatingFn = () => start + limit >= totalPages;

  return recursiveFetch({
    currentFetch: fetchPageAttributes({
      contentIds: allContentIds.slice(0, limit),
      attributes,
      limit,
    }),
    terminatingFn,
    getNextFetch: getNextPageAttributes,
  }).then(pageDetails => [pages, pageDetails]);
};

const getChildren = (contentId: string): Promise<any> =>
  getChildPages(contentId)
    .then(childPages => getPageAttributes(childPages))
    .then(mergePageDetails);

export { getChildren };
