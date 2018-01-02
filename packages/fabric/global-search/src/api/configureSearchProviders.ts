import RecentSearchProviderImpl, {
  RecentSearchProvider,
} from './RecentSearchProvider';
import CrossProductSearchProviderImpl, {
  CrossProductSearchProvider,
} from './CrossProductSearchProvider';

export interface SearchProviders {
  recentSearchProvider: RecentSearchProvider;
  crossProductSearchProvider: CrossProductSearchProvider;
}

const config = {
  local: {
    recentSearch: 'http://localhost:8080',
    crossProductSearch: 'http://localhost:8080',
  },
  development: {
    recentSearch: 'https://activity.domain.dev.atlassian.io',
    crossProductSearch: 'dev.net/search',
  },
  staging: {
    recentSearch: 'https://activity.staging.atlassian.io',
    crossProductSearch: 'stg.net/search',
  },
  production: {
    recentSearch: 'https://activity.atlassian.io',
    crossProductSearch: 'prod.net/search',
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

  return {
    recentSearchProvider: new RecentSearchProviderImpl(
      recentSearchUrl,
      cloudId,
    ),
    crossProductSearchProvider: new CrossProductSearchProviderImpl(
      crossProductSearchUrl,
      cloudId,
    ),
  };
}
