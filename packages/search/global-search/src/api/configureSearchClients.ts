import RecentSearchClientImpl, {
  RecentSearchClient,
} from './RecentSearchClient';
import CrossProductSearchClientImpl, {
  CrossProductSearchClient,
} from './CrossProductSearchClient';
import PeopleSearchClientImpl, {
  PeopleSearchClient,
} from './PeopleSearchClient';
import ConfluenceClientImpl, { ConfluenceClient } from './ConfluenceClient';
import JiraClientImpl, { JiraClient } from './JiraClient';

export interface SearchClients {
  recentSearchClient: RecentSearchClient;
  crossProductSearchClient: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
  confluenceClient: ConfluenceClient;
  jiraClient: JiraClient;
}

export interface Config {
  activityServiceUrl: string;
  searchAggregatorServiceUrl: string;
  directoryServiceUrl: string;
  confluenceUrl: string;
  jiraUrl: string;
  addSessionIdToJiraResult?: boolean;
}

const defaultConfig: Config = {
  activityServiceUrl: '/gateway/api/activity',
  searchAggregatorServiceUrl: '/gateway/api/xpsearch-aggregator',
  directoryServiceUrl: '/gateway/api/directory',
  confluenceUrl: '/wiki',
  jiraUrl: '',
  addSessionIdToJiraResult: false,
};

export default function configureSearchClients(
  cloudId: string,
  partialConfig: Partial<Config>,
): SearchClients {
  const config = {
    ...defaultConfig,
    ...partialConfig,
  };

  return {
    recentSearchClient: new RecentSearchClientImpl(
      config.activityServiceUrl,
      cloudId,
    ),
    crossProductSearchClient: new CrossProductSearchClientImpl(
      config.searchAggregatorServiceUrl,
      cloudId,
      config.addSessionIdToJiraResult,
    ),
    peopleSearchClient: new PeopleSearchClientImpl(
      config.directoryServiceUrl,
      cloudId,
    ),
    confluenceClient: new ConfluenceClientImpl(config.confluenceUrl, cloudId),
    jiraClient: new JiraClientImpl(
      config.jiraUrl,
      cloudId,
      config.addSessionIdToJiraResult,
    ),
  };
}
