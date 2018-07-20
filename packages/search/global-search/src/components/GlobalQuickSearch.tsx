import * as React from 'react';

import * as debounce from 'lodash.debounce';
import { QuickSearch } from '@atlaskit/quick-search';
import { LinkComponent } from './GlobalQuickSearchWrapper';
import {
  withAnalyticsEvents,
  AnalyticsContext,
} from '@atlaskit/analytics-next';

import { withAnalytics } from '@atlaskit/analytics';

import {
  fireSelectedSearchResult,
  fireHighlightedSearchResult,
  SelectedSearchResultEvent,
  AdvancedSearchSelectedEvent,
  KeyboardControlEvent,
  SearchResultEvent,
  fireSelectedAdvancedSearch,
  fireTextEnteredEvent,
  fireDismissedEvent,
} from '../util/analytics-event-helper';

import { CreateAnalyticsEventFn } from './analytics/types';
import { isAdvancedSearchResult } from './SearchResultsUtil';

const ATLASKIT_QUICKSEARCH_NS = 'atlaskit.navigation.quick-search';
const QS_ANALYTICS_EV_KB_CTRLS_USED = `${ATLASKIT_QUICKSEARCH_NS}.keyboard-controls-used`;
const QS_ANALYTICS_EV_SUBMIT = `${ATLASKIT_QUICKSEARCH_NS}.submit`;

export interface Props {
  onMount();
  onSearch(query: string);
  onSearchSubmit?();

  isLoading: boolean;
  placeholder?: string;
  query: string;
  searchSessionId: string;
  children: React.ReactNode;
  linkComponent?: LinkComponent;
  createAnalyticsEvent?: CreateAnalyticsEventFn;
  isSendSearchTermsEnabled?: boolean;
}

/**
 * Presentational component that renders the search input and search results.
 */
export class GlobalQuickSearch extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    isSendSearchTermsEnabled: false,
  };

  queryVersion: number = 0;
  resultSelected: boolean = false;

  componentDidMount() {
    this.props.onMount();
  }

  handleSearchInput = ({ target }) => {
    const query = target.value;
    this.debouncedSearch(query);
  };

  debouncedSearch = debounce(this.doSearch, 350);

  doSearch(query: string) {
    const {
      onSearch,
      searchSessionId,
      createAnalyticsEvent,
      isSendSearchTermsEnabled,
    } = this.props;
    onSearch(query);
    fireTextEnteredEvent(
      query,
      searchSessionId,
      this.queryVersion,
      isSendSearchTermsEnabled,
      createAnalyticsEvent,
    );
    this.queryVersion++;
  }

  fireSearchResultSelectedEvent = (eventData: SearchResultEvent) => {
    const { createAnalyticsEvent, searchSessionId, query } = this.props;
    this.resultSelected = true;
    if (isAdvancedSearchResult(eventData.resultId)) {
      fireSelectedAdvancedSearch(
        {
          ...eventData,
          query,
          queryVersion: this.queryVersion,
        } as AdvancedSearchSelectedEvent,
        searchSessionId,
        createAnalyticsEvent,
      );
    } else {
      fireSelectedSearchResult(
        eventData as SelectedSearchResultEvent,
        searchSessionId,
        createAnalyticsEvent,
      );
    }
  };

  fireSearchResultEvents = (
    eventName: string,
    eventData: SearchResultEvent,
  ) => {
    const { createAnalyticsEvent, searchSessionId } = this.props;
    if (eventName === QS_ANALYTICS_EV_SUBMIT) {
      this.fireSearchResultSelectedEvent(eventData);
    } else if (eventName === QS_ANALYTICS_EV_KB_CTRLS_USED) {
      const data = eventData as KeyboardControlEvent;
      if (data.key === 'ArrowDown' || data.key === 'ArrowUp') {
        fireHighlightedSearchResult(
          data,
          searchSessionId,
          createAnalyticsEvent,
        );
      }
    }
  };

  componentWillUnmount() {
    if (this.resultSelected) {
      return;
    }
    const { createAnalyticsEvent, searchSessionId } = this.props;
    fireDismissedEvent(searchSessionId, createAnalyticsEvent);
  }

  render() {
    const {
      query,
      isLoading,
      placeholder,
      linkComponent,
      children,
      onSearchSubmit,
    } = this.props;

    return (
      <AnalyticsContext data={{ searchSessionId: this.props.searchSessionId }}>
        <QuickSearch
          firePrivateAnalyticsEvent={this.fireSearchResultEvents}
          isLoading={isLoading}
          onSearchInput={this.handleSearchInput}
          placeholder={placeholder}
          value={query}
          linkComponent={linkComponent}
          onSearchSubmit={onSearchSubmit}
        >
          {children}
        </QuickSearch>
      </AnalyticsContext>
    );
  }
}

export default withAnalyticsEvents()(GlobalQuickSearch);
