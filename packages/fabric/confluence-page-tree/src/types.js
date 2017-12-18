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
