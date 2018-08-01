import * as React from 'react';
import { Result } from '../../model/Result';
import SearchError from '../SearchError';
import { isEmpty } from '../SearchResultsUtil';
import NoResultsState from './NoResultsState';
import PreQueryState from './PreQueryState';
import SearchResultsState from './SearchResultsState';

export interface Props {
  query: string;
  isError: boolean;
  retrySearch();
  recentlyViewedItems: Result[];
  recentResults: Result[];
  jiraResults: Result[];
  confluenceResults: Result[];
  peopleResults: Result[];
}

export default function searchResults(props: Props) {
  const {
    query,
    isError,
    retrySearch,
    recentlyViewedItems,
    recentResults,
    jiraResults,
    confluenceResults,
    peopleResults,
  } = props;

  if (isError) {
    return <SearchError onRetryClick={retrySearch} />;
  }

  if (query.length === 0) {
    return (
      <PreQueryState
        recentlyViewedItems={recentlyViewedItems}
        sectionIndex={0}
      />
    );
  }

  if (
    [recentResults, jiraResults, confluenceResults, peopleResults].every(
      isEmpty,
    )
  ) {
    return <NoResultsState query={query} />;
  }

  return (
    <SearchResultsState
      query={query}
      recentResults={recentResults}
      jiraResults={jiraResults}
      confluenceResults={confluenceResults}
      peopleResults={peopleResults}
    />
  );
}
