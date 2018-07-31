import * as React from 'react';
import SearchError from './SearchError';

export interface Props {
  query: string;
  isError: boolean;
  isLoading: boolean;
  retrySearch();
  keepPreQueryState: boolean;
  shouldRenderNoResultsState: () => boolean;
  renderPreQueryStateComponent: () => JSX.Element;
  renderNoResultsStateComponent: () => JSX.Element;
  renderSearchResultsStateComponent: () => JSX.Element;
}

export default class SearchResults extends React.Component<Props> {
  render() {
    const {
      query,
      isError,
      isLoading,
      retrySearch,
      keepPreQueryState,
      shouldRenderNoResultsState,
      renderPreQueryStateComponent,
      renderNoResultsStateComponent,
      renderSearchResultsStateComponent,
    } = this.props;

    if (isError) {
      return <SearchError onRetryClick={retrySearch} />;
    }

    if (query.length === 0) {
      if (isLoading) {
        return null;
      }

      return renderPreQueryStateComponent();
    }

    if (shouldRenderNoResultsState()) {
      if (isLoading && keepPreQueryState) {
        return renderPreQueryStateComponent();
      }

      return renderNoResultsStateComponent();
    }

    return renderSearchResultsStateComponent();
  }
}
