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

export interface SearchClients {
  recentSearchClient: RecentSearchClient;
  crossProductSearchClient: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
  confluenceClient: ConfluenceClient;
}

export interface Config {
  activityServiceUrl: string;
  searchAggregatorServiceUrl: string;
  directoryServiceUrl: string;
  confluenceUrl: string;
}

const defaultConfig: Config = {
  activityServiceUrl: '/gateway/api/activity',
  searchAggregatorServiceUrl: '/gateway/api/xpsearch-aggregator',
  directoryServiceUrl: '/gateway/api/directory',
  confluenceUrl: '/wiki',
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
    peopleSearchClient: new PeopleSearchClientImpl(
      config.directoryServiceUrl,
      cloudId,
    ),
    confluenceClient: new ConfluenceClientImpl(config.confluenceUrl, cloudId),
  };
}
