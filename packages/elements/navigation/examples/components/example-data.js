// @flow
import data from './data.json';

export type SearchResult = {
  group: string,
  item: {
    [x: string]: string,
    name: string,
  },
};

export default data;
