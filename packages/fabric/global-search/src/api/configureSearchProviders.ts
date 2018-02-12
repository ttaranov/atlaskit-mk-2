import RecentSearchProviderImpl, {
  RecentSearchProvider,
} from './RecentSearchProvider';
import CrossProductSearchProviderImpl, {
  CrossProductSearchProvider,
} from './CrossProductSearchProvider';
import PeopleSearchProviderImpl, {
  PeopleSearchProvider,
} from './PeopleSearchProvider';

export interface SearchProviders {
  recentSearchProvider: RecentSearchProvider;
  crossProductSearchProvider: CrossProductSearchProvider;
  peopleSearchProvider: PeopleSearchProvider;
}

interface Config {
  readonly [key: string]: {
    recentSearch: string;
    crossProductSearch: string;
    peopleSearch: string;
  };
}

const config: Config = {
  local: {
    recentSearch: 'http://localhost:8080',
    crossProductSearch: 'http://localhost:8080',
    peopleSearch: 'http://localhost:8080',
  },
  development: {
    recentSearch: 'https://activity.domain.dev.atlassian.io',
    crossProductSearch: 'https://api-private.dev.atlassian.com',
    peopleSearch: 'https://pf-directory-service.domain.dev.atlassian.io',
  },
  staging: {
    recentSearch: 'https://activity.staging.atlassian.io',
    crossProductSearch: 'https://api-private.stg.atlassian.com',
    peopleSearch: 'https://pf-directory-service.useast.staging.atlassian.io',
  },
  production: {
    recentSearch: 'https://activity.atlassian.io',
    crossProductSearch: 'https://api-private.atlassian.com',
    peopleSearch: 'https://pf-directory-service.atlassian.io',
  },
};

export default function configureSearchProviders(
  cloudId: string,
  environment: string,
): SearchProviders {
  if (!(environment in config)) {
    throw new Error(
      `Invalid environment. Valid options are: ${Object.keys(config)}`,
    );
  }

  const recentSearchUrl = config[environment].recentSearch;
  const crossProductSearchUrl = config[environment].crossProductSearch;
  const peopleSearchUrl = config[environment].peopleSearch;

  return {
    recentSearchProvider: new RecentSearchProviderImpl(
      recentSearchUrl,
      cloudId,
    ),
    crossProductSearchProvider: new CrossProductSearchProviderImpl(
      crossProductSearchUrl,
      cloudId,
    ),
    peopleSearchProvider: new PeopleSearchProviderImpl(
      peopleSearchUrl,
      cloudId,
    ),
  };
}
