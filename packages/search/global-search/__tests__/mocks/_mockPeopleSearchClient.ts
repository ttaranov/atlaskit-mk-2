import { PeopleSearchClient } from '../../src/api/PeopleSearchClient';

export const noResultsPeopleSearchClient: PeopleSearchClient = {
  search(query: string) {
    return Promise.resolve([]);
  },
};

export const errorPeopleSearchClient: PeopleSearchClient = {
  search(query: string) {
    return Promise.reject('error');
  },
};
