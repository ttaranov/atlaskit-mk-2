import { PeopleSearchClient } from '../../../api/PeopleSearchClient';
export const noResultsPeopleSearchClient: PeopleSearchClient = {
  search(query: string) {
    return Promise.resolve([]);
  },
  getRecentPeople() {
    return Promise.resolve([]);
  },
};

export const errorPeopleSearchClient: PeopleSearchClient = {
  search(query: string) {
    return Promise.reject('error');
  },
  getRecentPeople() {
    return Promise.reject('error');
  },
};

export const mockPeopleSearchClient = ({
  recentPeople,
  searchResultData,
}): PeopleSearchClient => ({
  search(query: string) {
    return Promise.resolve(searchResultData);
  },
  getRecentPeople() {
    return Promise.resolve(recentPeople);
  },
});
