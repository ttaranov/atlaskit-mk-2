import RecentSearchClientImpl, {
  RecentSearchClient,
} from './RecentSearchClient';
import CrossProductSearchClientImpl, {
  CrossProductSearchClient,
} from './CrossProductSearchClient';
import PeopleSearchClientImpl, {
  PeopleSearchClient,
} from './PeopleSearchClient';

export interface SearchClients {
  recentSearchClient: RecentSearchClient;
  crossProductSearchClient: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
}

export interface Config {
  activityServiceUrl: string;
  searchAggregatorServiceUrl: string;
  directoryServiceUrl: string;
}

const defaultConfig: Config = {
  activityServiceUrl: '/gateway/api/activity',
  searchAggregatorServiceUrl: '/gateway/api',
  directoryServiceUrl: '/gateway/api/directory',
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
  };
}
