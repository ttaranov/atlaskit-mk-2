import * as React from 'react';
import { Result } from '../../model/Result';
import { isEmpty } from '../SearchResultsUtil';
import NoResultsState from './NoResultsState';
import PreQueryState from './PreQueryState';
import SearchResultsState from './SearchResultsState';
import SearchResults from '../SearchResults';

export interface Props {
  query: string;
  isLoading: boolean;
  isError: boolean;
  keepPreQueryState: boolean;
  retrySearch();
  recentlyViewedItems: Result[];
  recentResults: Result[];
  jiraResults: Result[];
  confluenceResults: Result[];
  peopleResults: Result[];
}

export default class HomeSearchResults extends React.Component<Props> {
  render() {
    const {
      query,
      isLoading,
      isError,
      keepPreQueryState,
      retrySearch,
      recentlyViewedItems,
      recentResults,
      jiraResults,
      confluenceResults,
      peopleResults,
    } = this.props;

    return (
      <SearchResults
        retrySearch={retrySearch}
        query={query}
        isLoading={isLoading}
        isError={isError}
        keepPreQueryState={keepPreQueryState}
        renderPreQueryStateComponent={() => (
          <PreQueryState
            recentlyViewedItems={recentlyViewedItems}
            sectionIndex={0}
          />
        )}
        shouldRenderNoResultsState={() =>
          [recentResults, jiraResults, confluenceResults, peopleResults].every(
            isEmpty,
          )
        }
        renderNoResultsStateComponent={() => <NoResultsState query={query} />}
        renderSearchResultsStateComponent={() => (
          <SearchResultsState
            query={query}
            recentResults={recentResults}
            jiraResults={jiraResults}
            confluenceResults={confluenceResults}
            peopleResults={peopleResults}
          />
        )}
      />
    );
  }
}
