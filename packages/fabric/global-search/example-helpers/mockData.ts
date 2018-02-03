import * as faker from 'faker';
import { GraphqlResponse, SearchResult } from '../src/api/PeopleSearchProvider';
import {
  RecentItemsResponse,
  RecentItem,
} from '../src/api/RecentSearchProvider';

function objectIconUrl() {
  const urls = [
    'https://product-fabric.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype',
    'https://home.useast.atlassian.io/confluence-page-icon.svg',
    'https://product-fabric.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10303&avatarType=issuetype',
  ];

  const index = faker.random.number(urls.length - 1);
  return urls[index];
}

function provider() {
  const providers = ['jira', 'confluence'];

  const index = faker.random.number(providers.length - 1);
  return providers[index];
}

export function recentData(n = 50): RecentItemsResponse {
  const items = [];

  for (let i = 0; i < n; i++) {
    items.push({
      objectId: faker.random.uuid(),
      name: faker.company.catchPhrase(),
      iconUrl: objectIconUrl(),
      container: faker.company.companyName(),
      url: faker.internet.url(),
      provider: provider(),
    });
  }

  return {
    data: items,
  };
}

export function crossProductData() {
  return recentData(300);
}

export function peopleData(n = 300): GraphqlResponse {
  const items: SearchResult[] = [];

  for (let i = 0; i < n; i++) {
    items.push({
      id: faker.random.uuid(),
      fullName: faker.name.findName(),
      avatarUrl: faker.image.avatar(),
    });
  }

  return {
    data: {
      AccountCentricUserSearch: items,
    },
  };
}
