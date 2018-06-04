import * as faker from 'faker';
import { GraphqlResponse, SearchResult } from '../src/api/PeopleSearchClient';
import { RecentItemsResponse, RecentItem } from '../src/api/RecentSearchClient';
import {
  CrossProductSearchResponse,
  Scope,
  SearchItem,
  ConfluenceItem,
  JiraItem,
} from '../src/api/CrossProductSearchClient';
import { RecentPage, RecentSpace } from '../src/api/ConfluenceClient';
import { ResultContentType } from '../src/model/Result';

const DUMMY_BASE_URL = 'http://localhost';

function pickRandom(array: Array<any>) {
  const index = faker.random.number(array.length - 1);
  return array[index];
}

function randomJiraIconUrl() {
  const urls = [
    'https://product-fabric.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype',
    'https://product-fabric.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10303&avatarType=issuetype',
  ];

  return pickRandom(urls);
}

function randomConfluenceIconUrl() {
  const urls = [
    'https://home.useast.atlassian.io/confluence-page-icon.svg',
    'https://home.useast.atlassian.io/confluence-blogpost-icon.svg',
  ];

  return pickRandom(urls);
}

function randomProvider() {
  const providers = ['jira', 'confluence'];
  return pickRandom(providers);
}

function randomIssueKey() {
  const keys = ['ETH', 'XRP', 'ADA', 'TRON', 'DOGE'];
  return pickRandom(keys) + '-' + faker.random.number(1000);
}

function randomSpaceIconUrl() {
  return `https://placeimg.com/64/64/arch?bustCache=${Math.random()}`;
}

export function recentData(n = 50): RecentItemsResponse {
  const items = [];

  for (let i = 0; i < n; i++) {
    const provider = randomProvider();

    const name =
      provider === 'jira'
        ? `${randomIssueKey()} ${faker.company.catchPhrase()}`
        : faker.company.catchPhrase();

    const iconUrl =
      provider === 'jira' ? randomJiraIconUrl() : randomConfluenceIconUrl();

    items.push({
      objectId: faker.random.uuid(),
      name: name,
      iconUrl: iconUrl,
      container: faker.company.companyName(),
      url: faker.internet.url(),
      provider: provider,
    });
  }

  return {
    data: items,
  };
}

export function makeCrossProductSearchData(
  n = 100,
): (term: string) => CrossProductSearchResponse {
  const confData: ConfluenceItem[] = [];
  const confSpaceData: ConfluenceItem[] = [];
  const confDataWithAttachments: ConfluenceItem[] = [];
  const jiraData: JiraItem[] = [];

  for (let i = 0; i < n; i++) {
    const url = faker.internet.url();
    confData.push({
      title: faker.company.catchPhrase(),
      container: {
        title: faker.company.companyName(),
        displayUrl: url,
      },
      url: url,
      baseUrl: DUMMY_BASE_URL,
      content: {
        type: pickRandom(['page', 'blogpost']),
      },
    });
  }

  for (let i = 0; i < n; i++) {
    const url = faker.internet.url();

    const newAttachment: ConfluenceItem = {
      title: faker.company.catchPhrase(),
      container: {
        title: faker.company.companyName(),
        displayUrl: url,
      },
      url: url,
      baseUrl: DUMMY_BASE_URL,
      content: {
        type: pickRandom(['page', 'blogpost', 'attachment']),
      },
    };

    confDataWithAttachments.push(newAttachment);
  }

  for (let i = 0; i < n; i++) {
    const title = faker.company.companyName();
    confSpaceData.push({
      title: title,
      baseUrl: '',
      url: faker.internet.url(),
      content: null,
      container: {
        title: title,
        displayUrl: faker.internet.url(),
      },
      space: {
        icon: {
          path: randomSpaceIconUrl(),
        },
      },
    });
  }

  for (let i = 0; i < n; i++) {
    jiraData.push({
      key: randomIssueKey(),
      fields: {
        summary: faker.company.catchPhrase(),
        project: {
          name: faker.company.companyName(),
        },
        issuetype: {
          iconUrl: randomJiraIconUrl(),
        },
      },
    });
  }

  return (term: string) => {
    term = term.toLowerCase();

    const filteredConfResults = confData.filter(
      result => result.title.toLowerCase().indexOf(term) > -1,
    );

    const filteredJiraResults = jiraData.filter(
      result => result.fields.summary.toLowerCase().indexOf(term) > -1,
    );

    const filteredSpaceResults = confSpaceData.filter(
      result => result.container.title.toLowerCase().indexOf(term) > -1,
    );

    const filteredConfResultsWithAttachments = confDataWithAttachments.filter(
      result => result.container.title.toLowerCase().indexOf(term) > -1,
    );

    return {
      scopes: [
        {
          id: Scope.ConfluencePageBlog,
          results: filteredConfResults,
        },
        {
          id: Scope.ConfluencePageBlogAttachment,
          results: filteredConfResultsWithAttachments,
        },
        {
          id: Scope.JiraIssue,
          results: filteredJiraResults,
        },
        {
          id: Scope.ConfluenceSpace,
          results: filteredSpaceResults,
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
      department: faker.name.jobType(),
      title: faker.name.jobTitle(),
      nickname: faker.name.lastName(),
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
        Collaborators: filteredItems,
      },
    };
  };
}

export function makeConfluenceRecentPagesData(n: number = 300) {
  const items: RecentPage[] = [];

  for (let i = 0; i < n; i++) {
    items.push({
      available: true,
      contentType: ResultContentType.Page,
      id: faker.random.uuid(),
      lastSeen: faker.date.past(1).getTime(),
      space: faker.company.companyName(),
      spaceKey: faker.hacker.abbreviation(),
      title: faker.company.catchPhrase(),
      type: 'page',
      url: faker.internet.url(),
    });
  }

  return items;
}

export function makeConfluenceRecentSpacesData(n: number = 15) {
  const spaces: RecentSpace[] = [];

  for (let i = 0; i < n; i++) {
    spaces.push({
      id: faker.random.uuid(),
      key: faker.hacker.abbreviation(),
      icon: randomSpaceIconUrl(),
      name: faker.company.companyName(),
    });
  }

  return spaces;
}
