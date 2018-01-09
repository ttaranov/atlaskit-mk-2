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

// TODO provide real URLs
const config = {
  local: {
    recentSearch: 'http://localhost:8080',
    crossProductSearch: 'http://localhost:8080',
    peopleSearch: 'http://localhost:8080',
  },
  development: {
    recentSearch: 'https://activity.domain.dev.atlassian.io',
    crossProductSearch: 'dev.net/search',
    peopleSearch: 'https://pf-directory-service.atlassian.io',
  },
  staging: {
    recentSearch: 'https://activity.staging.atlassian.io',
    crossProductSearch: 'stg.net/search',
    peopleSearch: 'https://pf-directory-service.atlassian.io',
  },
  production: {
    recentSearch: 'https://activity.atlassian.io',
    crossProductSearch: 'prod.net/search',
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
