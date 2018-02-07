import * as faker from 'faker';
import { GraphqlResponse, SearchResult } from '../src/api/PeopleSearchProvider';
import {
  RecentItemsResponse,
  RecentItem,
} from '../src/api/RecentSearchProvider';
import {
  CrossProductSearchResponse,
  Scope,
  SearchItem,
} from '../src/api/CrossProductSearchProvider';

function pickRandom(array: Array<any>) {
  const index = faker.random.number(array.length - 1);
  return array[index];
}

function objectIconUrl() {
  const urls = [
    'https://product-fabric.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype',
    'https://home.useast.atlassian.io/confluence-page-icon.svg',
    'https://product-fabric.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10303&avatarType=issuetype',
  ];

  return pickRandom(urls);
}

function provider() {
  const providers = ['jira', 'confluence'];
  return pickRandom(providers);
}

function iconCssClass() {
  const classes = [
    'aui-iconfont-page-default',
    'aui-iconfont-homepage',
    'aui-iconfont-page-blogpost',
  ];
  return pickRandom(classes);
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

export function makeCrossProductSearchData(
  n = 100,
): (term: string) => CrossProductSearchResponse {
  const confData: SearchItem[] = [];

  for (let i = 0; i < n; i++) {
    confData.push({
      title: faker.company.catchPhrase(),
      container: {
        title: faker.company.companyName(),
      },
      iconCssClass: iconCssClass(),
      url: faker.internet.url(),
    });
  }

  return (term: string) => {
    term = term.toLowerCase();
    const filteredConfResults = confData.filter(
      result => result.title.toLowerCase().indexOf(term) > -1,
    );

    return {
      scopes: [
        {
          id: Scope.ConfluencePage,
          results: filteredConfResults,
        },
      ],
    };
  };
}

export function makePeopleSearchData(
  n = 300,
): (term: string) => GraphqlResponse {
  const items: SearchResult[] = [];

  for (let i = 0; i < n; i++) {
    items.push({
      id: faker.random.uuid(),
      fullName: faker.name.findName(),
      avatarUrl: faker.image.avatar(),
    });
  }

  return (term: string) => {
    term = term.toLowerCase();
    const filteredItems = items.filter(
      item => item.fullName.toLowerCase().indexOf(term) > -1,
    );

    return {
      data: {
        AccountCentricUserSearch: filteredItems,
      },
    };
  };
}
