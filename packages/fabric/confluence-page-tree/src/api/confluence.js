// @flow
import type { PageData, PageAttribute } from '../types';

const makeRecursiveFetch = (
  currentFetch: Promise<any>,
  terminatingFn: (response: any) => boolean,
  getNextFetch: () => Promise<any>,
  currentResult?: Array<Object> = [],
): Promise<any> => {
  return currentFetch.then((response: { results: Array<Object> }) => {
    const { results } = response;
    const finalResult: Array<Object> = [...currentResult, ...results];

    return terminatingFn(response)
      ? Promise.resolve(finalResult)
      : makeRecursiveFetch(
          getNextFetch(),
          terminatingFn,
          getNextFetch,
          finalResult,
        );
  });
};

const getAllChildPages = (contentId: string): Promise<any> => {
  let start: number = 0;
  const limit: number = 200;
  return makeRecursiveFetch(
    getChildPages(contentId),
    //({ size }) => size < limit,
    //TODO: to be removed
    ({ size }) => start === 0,
    () => {
      start += limit;
      return getChildPages(contentId, start, limit);
    },
  );
};

const getChildPages = (
  contentId: string,
  start?: number = 0,
  limit?: number = 200,
): Promise<any> => {
  const url: string = `/wiki/rest/api/content/${contentId}/child/page?limit=${
    limit
  }&start=${start}&expand=container,childTypes.page`;

  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  }).then(response => response.json());
};

const getPageAttributes = (
  contentIds: Array<string>,
  attributes: string,
  limit?: number = 200,
): Promise<any> => {
  const contentIdParam: string = encodeURIComponent(
    `id in (${contentIds.join()})`,
  );
  const url: string = `/wiki/rest/api/content/search?cql=${
    contentIdParam
  }&limit=${limit}&expand=${attributes}`;

  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  }).then(response => response.json());
};

const mergePageDetails = ([pageList, pageAttributes]) => {
  return pageList.map((page: PageData) => {
    const { history = {} } = pageAttributes.find(
      (pageAttribute: PageAttribute) => pageAttribute.id === page.id,
    );
    const { lastUpdated, contributors } = history;

    return {
      ...page,
      lastUpdated,
      contributors,
    };
  });
};

const extractContentIdsAndGetPageAttributes = (
  pages: Array<PageData>,
): Promise<any> => {
  const attributes: string =
    'history.contributors.publishers.users,history.lastUpdated';
  const limit: number = 200;
  const childPageIds: Array<string> = pages.map(childPage => childPage.id);
  let start: number = 0;
  let subChildPageIds: Array<string> = childPageIds.slice(start, limit);

  return makeRecursiveFetch(
    getPageAttributes(subChildPageIds, attributes),
    () => start + limit >= childPageIds.length,
    () => {
      start += limit;
      subChildPageIds = childPageIds.slice(
        start,
        start + limit < childPageIds.length
          ? start + limit
          : childPageIds.length,
      );
      return getPageAttributes(subChildPageIds, attributes);
    },
  ).then(pageDetails => [pages, pageDetails]);
};

const getChildPageDetails = (contentId: string): Promise<any> => {
  return getAllChildPages(contentId)
    .then(childPages => extractContentIdsAndGetPageAttributes(childPages))
    .then(mergePageDetails);
};

export { getChildPageDetails };
