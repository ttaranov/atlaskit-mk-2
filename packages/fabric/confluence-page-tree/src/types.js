// @flow

export type PageData = {
  id: string,
  title: string,
  childTypes: {
    page: {
      value: string,
    },
  },
};
export type PageAttribute = {
  id: string,
  history: any,
};

export type pageAttributesArgs = {
  contentIds: Array<string>,
  attributes: string,
  limit: number,
};

export type recursiveFetchArgs = {
  currentFetch: Promise<any>,
  terminatingFn: (response: any) => boolean,
  getNextFetch: () => Promise<any>,
  accumulator?: Array<any>,
};
