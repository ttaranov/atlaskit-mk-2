import { GraphqlResponse, SearchResult } from '../src/api/PeopleSearchClient';
import { RecentItemsResponse } from '../src/api/RecentSearchClient';
import { QuickNavResult } from '../src/api/ConfluenceClient';
import {
  CrossProductSearchResponse,
  Scope,
  ConfluenceItem,
  JiraItem,
} from '../src/api/CrossProductSearchClient';

import * as uuid from 'uuid/v4';
import {
  Entry,
  ScopeResult as JiraScope,
} from '../src/api/CrossProductSearchTypesV2';
const DUMMY_BASE_URL = 'http://localhost';

function pickRandom(array: Array<any>) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

function generateRandomElements<T>(generator: () => T, n: number = 50) {
  const results: T[] = [];
  for (let i = 0; i < n; i++) {
    results.push(generator());
  }
  return results;
}

const mockCatchPhrases = [
  'Focused bandwidth-monitored open system',
  'Synergistic multi-tasking architecture',
  'Robust national conglomeration',
  'Mandatory heuristic groupware',
  'Triple-buffered multi-tasking methodology',
  'Reduced dedicated initiative',
  'Triple-buffered analyzing superstructure',
  'Optimized intangible initiative',
];

const mockCompanyNames = [
  'Gusikowski, Schimmel and Rau',
  'Gaylord, Kreiger and Hand',
  'Harber - Rowe',
  'Senger Group',
  'McGlynn, McLaughlin and Connelly',
  'Kovacek Inc',
  'Muller - Ortiz',
  'Heaney, Heller and Corwin',
];
const mockAbbreviations = [
  'CSS',
  'RSS',
  'GB',
  'CSS',
  'ADP',
  'FTP',
  'GB',
  'EXE',
];
const mockAvatarUrls = [
  'https://s3.amazonaws.com/uifaces/faces/twitter/magugzbrand2d/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/jonathansimmons/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/megdraws/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/vickyshits/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/ainsleywagon/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/xamorep/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/shoaib253/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/jefffis/128.jpg',
];
const mockUrls = [
  'https://jacquelyn.name',
  'https://sheridan.net',
  'http://carmelo.info',
  'https://zoe.biz',
  'https://kris.net',
  'http://kolby.net',
  'http://aracely.com',
  'http://justyn.org',
];
const mockNames = [
  'Priya Brantley',
  'Tomas MacGinnis',
  'Osiris Meszaros',
  'Newell Corkery',
  'Sif Leitzke',
  'Garfield Schulist',
  'Julianne Osinski',
];

const mockJobTitles = [
  'Legacy Interactions Orchestrator',
  'Chief Directives Officer',
  'Future Directives Designer',
  'Lead Communications Manager',
  'Customer Paradigm Consultant',
  'Human Branding Designer',
  'Internal Markets Strategist',
  'National Group Officer',
];

const mockJobTypes = [
  'Supervisor',
  'Coordinator',
  'Agent',
  'Administrator',
  'Producer',
  'Director',
  'Specialist',
];
const mockLastNames = [
  'Brantley',
  'MacGinnis',
  'Meszaros',
  'Corkery',
  'Leitzke',
  'Schulist',
  'Osinski',
];

const jiraTypeGenerator = {
  issues: generateRandomJiraIssue,
  boards: generateRandomJiraBoard,
  projects: generateRandomJiraProject,
  filters: generateRandomJiraFilter,
};

const getMockCompanyName = () => pickRandom(mockCompanyNames);
const getMockCatchPhrase = () => pickRandom(mockCatchPhrases);
const getMockAbbreviation = () => pickRandom(mockAbbreviations);
const getMockAvatarUrl = () => pickRandom(mockAvatarUrls);
const getMockUrl = () => pickRandom(mockUrls);
const getMockName = () => pickRandom(mockNames);
const getMockJobTitle = () => pickRandom(mockJobTitles);
const getMockJobType = () => pickRandom(mockJobTypes);
const getMockLastName = () => pickRandom(mockLastNames);

const getDateWithOffset = offset => {
  let time = new Date();
  time.setTime(time.getTime() + offset);
  return time;
};

const getPastDate = () => {
  let offset = 0 - Math.round(Math.random() * 365 * 24 * 3600 * 1000);
  return getDateWithOffset(offset);
};

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
  return pickRandom(keys) + '-' + Math.floor(Math.random() * 1000);
}

function randomSpaceIconUrl() {
  return `https://placeimg.com/64/64/arch?bustCache=${Math.random()}`;
}

export function recentData(n = 50): RecentItemsResponse {
  const items: any = [];

  for (let i = 0; i < n; i++) {
    const provider = randomProvider();

    const name =
      provider === 'jira'
        ? `${randomIssueKey()} ${getMockCatchPhrase()}`
        : getMockCatchPhrase();

    const iconUrl =
      provider === 'jira' ? randomJiraIconUrl() : randomConfluenceIconUrl();

    items.push({
      objectId: uuid(),
      name: name,
      iconUrl: iconUrl,
      container: getMockCompanyName(),
      url: getMockUrl(),
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
    const url = getMockUrl();
    const type = pickRandom(['page', 'blogpost']);
    const icon =
      type === 'page'
        ? 'aui-iconfont-page-default'
        : 'aui-iconfont-blogpost-default';
    confData.push({
      title: getMockCatchPhrase(),
      container: {
        title: getMockCompanyName(),
        displayUrl: url,
      },
      url: url,
      baseUrl: DUMMY_BASE_URL,
      content: {
        id: uuid(),
        type: type,
      },
      iconCssClass: icon,
    });
  }

  for (let i = 0; i < n; i++) {
    const url = getMockUrl();
    const type = pickRandom(['page', 'blogpost', 'attachment']);

    const title =
      type === 'attachment'
        ? `${getMockCatchPhrase()}.mp3`
        : getMockCatchPhrase();
    const icon =
      type === 'attachment' ? 'icon-file-audio' : 'aui-iconfont-page-default';

    const newAttachment: ConfluenceItem = {
      title: title,
      container: {
        title: getMockCompanyName(),
        displayUrl: url,
      },
      url: url,
      baseUrl: DUMMY_BASE_URL,
      content: {
        id: uuid(),
        type: type,
      },
      iconCssClass: icon,
    };

    confDataWithAttachments.push(newAttachment);
  }

  for (let i = 0; i < n; i++) {
    const title = getMockCompanyName();
    confSpaceData.push({
      title: title,
      baseUrl: '',
      url: getMockUrl(),
      content: {
        id: uuid(),
        type: i % 3 ? 'blogpost' : 'page',
      },
      container: {
        title: title,
        displayUrl: getMockUrl(),
      },
      space: {
        key: getMockAbbreviation(),
        icon: {
          path: randomSpaceIconUrl(),
        },
      },
      iconCssClass: 'aui-iconfont-space-default',
    });
  }

  for (let i = 0; i < n; i++) {
    jiraData.push({
      key: randomIssueKey(),
      fields: {
        summary: getMockCatchPhrase(),
        project: {
          name: getMockCompanyName(),
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
      result => result.title.toLowerCase().indexOf(term) > -1,
    );

    const abTest = {
      experimentId: 'experiment-1',
      controlId: 'control-id',
      abTestId: 'abtest-id',
    };

    return {
      scopes: [
        {
          id: Scope.ConfluencePageBlog,
          experimentId: 'experiment-1',
          abTest,
          results: filteredConfResults,
        },
        {
          id: Scope.ConfluencePageBlogAttachment,
          experimentId: 'experiment-1',
          abTest,
          results: filteredConfResultsWithAttachments,
        },
        {
          id: Scope.JiraIssue,
          experimentId: 'experiment-1',
          abTest,
          results: filteredJiraResults,
        },
        {
          id: Scope.ConfluenceSpace,
          experimentId: 'experiment-1',
          abTest,
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
      id: uuid(),
      fullName: getMockName(),
      avatarUrl: getMockAvatarUrl(),
      department: getMockJobType(),
      title: getMockJobTitle(),
      nickname: getMockLastName(),
    });
  }

  return (term: string) => {
    term = term.toLowerCase();
    const filteredItems = items.filter(
      item => item.fullName.toLowerCase().indexOf(term) > -1,
    );

    return {
      data: {
        UserSearch: filteredItems,
        AccountCentricUserSearch: filteredItems,
        Collaborators: filteredItems,
      },
    };
  };
}

function generateRandomQuickNavItem(className: string) {
  return {
    className: className,
    name: getMockCatchPhrase(),
    href: getMockUrl(),
    spaceName: getMockCompanyName(),
    id: uuid(),
  };
}

function getIssueTypeId(name) {
  const issueTypeMap = {
    task: 10001,
    story: 10002,
    bug: 10003,
    epic: 10004,
  };
  return issueTypeMap[name];
}

const getIssueAvatar = issueType =>
  `https://product-fabric.atlassian.net/images/icons/issuetypes/${issueType}.svg`;
const getIssueUrl = key => `https://product-fabric.atlassian.net/browse/${key}`;
const getProjectUrl = porjectKey =>
  `https://product-fabric.atlassian.net/browse/${porjectKey}`;
const getFilterUrl = () =>
  `https://product-fabric.atlassian.net/browse/filter=${Math.floor(
    (Math.random() * -10) % 5,
  )}`;

function generateRandomJiraIssue(): Entry {
  const issueTypeName = pickRandom(['task', 'story', 'bug', 'epic']);
  const key = randomIssueKey();
  return {
    id: uuid(),
    name: getMockCatchPhrase(),
    url: getIssueUrl(key),
    attributes: {
      '@type': 'issue',
      containerId: uuid(),
      key,
      issueTypeName,
      issueTypeId: getIssueTypeId(issueTypeName),
      avatar: {
        url: getIssueAvatar(issueTypeName),
      },
    },
  };
}

function generateRandomJiraProject(): Entry {
  const key = getMockAbbreviation();
  return {
    id: uuid(),
    name: getMockCatchPhrase(),
    url: getProjectUrl(key),
    attributes: {
      '@type': 'project',
      projectType: pickRandom([
        'Software project',
        'Core projects',
        'Servicedesk project',
      ]),
      avatar: {
        url: randomSpaceIconUrl(),
      },
    },
  };
}

function generateRandomJiraBoard(): Entry {
  const key = getMockAbbreviation();
  return {
    id: uuid(),
    name: getMockCatchPhrase(),
    url: getProjectUrl(key),
    attributes: {
      '@type': 'board',
      containerId: uuid(),
      containerName: key,
      avatar: {
        url: randomSpaceIconUrl(),
      },
    },
  };
}

function generateRandomJiraFilter(): Entry {
  return {
    id: uuid(),
    name: getMockCatchPhrase(),
    url: getFilterUrl(),
    attributes: {
      '@type': 'filter',
      ownerId: uuid(),
      ownerName: getMockLastName(),
      avatar: {
        url: randomSpaceIconUrl(),
      },
    },
  };
}

export function generateJiraScope(type: string, n: number, query?): JiraScope {
  const results = generateRandomElements<Entry>(
    () => jiraTypeGenerator[type](),
    n,
  );
  return {
    id: type,
    results: query
      ? results.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase()),
        )
      : results,
    abTest: {
      experimentId: uuid(),
      controlId: uuid(),
      abTestId: uuid(),
    },
  };
}

export function generateJiraScopeWithError(
  type: string,
  n: number,
  errorMessage: string,
  query?,
): JiraScope {
  const scope = generateJiraScope(type, n, query);
  scope.error = {
    message: errorMessage,
  };
  return scope;
}

export function mockJiraSearchData(n: number = 50) {
  return (query: string) => ({
    scopes: Object.keys(jiraTypeGenerator)
      .map(key => generateJiraScope(key, n, query))
      .reduce((scopes, scope) => [...scopes, scope], []),
  });
}

export function makeQuickNavSearchData(n: number = 50) {
  // create some attachments
  const attachments: QuickNavResult[] = generateRandomElements(() =>
    generateRandomQuickNavItem(
      'content-type-attachment-' + pickRandom(['image', 'pdf']),
    ),
  );

  // create some pages
  const pages: QuickNavResult[] = generateRandomElements(() =>
    generateRandomQuickNavItem('content-type-page'),
  );

  // create some blogposts
  const blogs: QuickNavResult[] = generateRandomElements(() =>
    generateRandomQuickNavItem('content-type-blogpost'),
  );

  // create some people, which never get shown
  const people: QuickNavResult[] = generateRandomElements(() =>
    generateRandomQuickNavItem('content-type-userinfo'),
  );

  return (term: string) => {
    term = term.toLowerCase();

    const filteredPages = pages.filter(
      result => result.name.toLowerCase().indexOf(term) > -1,
    );

    const filteredBlogposts = blogs.filter(
      result => result.name.toLowerCase().indexOf(term) > -1,
    );

    const filteredAttachments = attachments.filter(
      result => result.name.toLowerCase().indexOf(term) > -1,
    );

    const filteredPeople = people.filter(
      result => result.name.toLowerCase().indexOf(term) > -1,
    );

    return {
      contentNameMatches: [
        filteredPages,
        filteredAttachments,
        filteredBlogposts,
        filteredPeople,
      ],
    };
  };
}

export function makeConfluenceRecentPagesData(n: number = 300) {
  return generateRandomElements(() => {
    return {
      available: true,
      contentType: 'page',
      id: uuid(),
      lastSeen: getPastDate().getTime(),
      space: getMockCompanyName(),
      spaceKey: getMockAbbreviation(),
      title: getMockCatchPhrase(),
      type: 'page',
      url: getMockUrl(),
    };
  }, n);
}

export function makeConfluenceRecentSpacesData(n: number = 15) {
  return generateRandomElements(() => {
    return {
      id: uuid(),
      key: getMockAbbreviation(),
      icon: randomSpaceIconUrl(),
      name: getMockCompanyName(),
    };
  }, n);
}

export function mapRequestScopes(requestScopes, resultScopes) {
  return requestScopes.map(requestScope => {
    return requestScope
      .split('.')[1]
      .split(',')
      .map(scope => resultScopes.scopes.find(({ id }) => id.includes(scope)))
      .filter(scopeResult => !!scopeResult)
      .reduce(
        (acc, current) => {
          if (current.error) {
            acc.error = current.error;
          }
          if (current.abTest) {
            acc.abTest = current.abTest;
          }
          acc.results = [...acc.results, ...current.results];
          return acc;
        },
        {
          id: requestScope,
          results: [],
        },
      );
  });
}
