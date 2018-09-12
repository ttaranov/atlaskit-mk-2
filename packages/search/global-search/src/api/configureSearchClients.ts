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
import CrossProductSearchClientImplV2, {
  CrossProductSearchClient as CrossProductSearchClientV2,
} from './CrossProductSearchClientV2';

export interface SearchClients {
  recentSearchClient: RecentSearchClient;
  crossProductSearchClient: CrossProductSearchClient;
  crossProductSearchClientV2: CrossProductSearchClientV2;
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
}

const defaultConfig: Config = {
  activityServiceUrl: '/gateway/api/activity',
  searchAggregatorServiceUrl: '/gateway/api/xpsearch-aggregator',
  directoryServiceUrl: '/gateway/api/directory',
  confluenceUrl: '/wiki',
  jiraUrl: '',
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
    ),
    crossProductSearchClientV2: new CrossProductSearchClientImplV2(
      config.searchAggregatorServiceUrl,
      cloudId,
    ),
    peopleSearchClient: new PeopleSearchClientImpl(
      config.directoryServiceUrl,
      cloudId,
    ),
    confluenceClient: new ConfluenceClientImpl(config.confluenceUrl, cloudId),
    jiraClient: new JiraClientImpl(config.jiraUrl, cloudId),
  };
}
