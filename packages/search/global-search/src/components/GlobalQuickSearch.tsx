import * as React from 'react';

import * as debounce from 'lodash.debounce';
import { QuickSearch } from '@atlaskit/quick-search';
import { LinkComponent } from './GlobalQuickSearchWrapper';
import {
  withAnalyticsEvents,
  AnalyticsContext,
} from '@atlaskit/analytics-next';

import {
  fireSelectedSearchResult,
  fireHighlightedSearchResult,
  SelectedSearchResultEvent,
  AdvancedSearchSelectedEvent,
  KeyboardControlEvent,
  fireSelectedAdvancedSearch,
  fireTextEnteredEvent,
  fireDismissedEvent,
} from '../util/analytics-event-helper';

import { CreateAnalyticsEventFn } from './analytics/types';
import {
  isAdvancedSearchResult,
  ADVANCED_CONFLUENCE_SEARCH_RESULT_ID,
} from './SearchResultsUtil';

const ATLASKIT_QUICKSEARCH_NS = 'atlaskit.navigation.quick-search';
const QS_ANALYTICS_EV_KB_CTRLS_USED = `${ATLASKIT_QUICKSEARCH_NS}.keyboard-controls-used`;
const QS_ANALYTICS_EV_SUBMIT = `${ATLASKIT_QUICKSEARCH_NS}.submit`;

export interface Props {
  onMount();
  onSearch(query: string);
  onSearchSubmit?(event: React.KeyboardEvent<HTMLInputElement>);

  isLoading: boolean;
  placeholder?: string;
  searchSessionId: string;
  children: React.ReactNode;
  linkComponent?: LinkComponent;
  createAnalyticsEvent?: CreateAnalyticsEventFn;
  isSendSearchTermsEnabled?: boolean;
}

export interface State {
  query: string;
}

/**
 * Presentational component that renders the search input and search results.
 */
export class GlobalQuickSearch extends React.Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    isSendSearchTermsEnabled: false,
  };
  queryVersion: number = 0;
  resultSelected: boolean = false;

  state = {
    query: '',
  };

  componentDidMount() {
    this.props.onMount();
  }

  handleSearchInput = ({ target }) => {
    const query = target.value;
    this.setState({
      query,
    });
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
    onSearch(query.trim());
    fireTextEnteredEvent(
      query,
      searchSessionId,
      this.queryVersion,
      isSendSearchTermsEnabled,
      createAnalyticsEvent,
    );
    this.queryVersion++;
  }

  fireSearchResultSelectedEvent = (eventData: SelectedSearchResultEvent) => {
    const { createAnalyticsEvent, searchSessionId } = this.props;
    this.resultSelected = true;
    const resultId =
      eventData.resultCount && eventData.method === 'shortcut'
        ? ADVANCED_CONFLUENCE_SEARCH_RESULT_ID
        : eventData.resultId;
    if (isAdvancedSearchResult(resultId)) {
      fireSelectedAdvancedSearch(
        {
          ...eventData,
          resultId,
          query: this.state.query,
          queryVersion: this.queryVersion,
          isLoading: this.props.isLoading,
        } as AdvancedSearchSelectedEvent,
        searchSessionId,
        createAnalyticsEvent,
      );
    } else {
      fireSelectedSearchResult(
        {
          ...eventData,
          query: this.state.query,
          queryVersion: this.queryVersion,
        },
        searchSessionId,
        createAnalyticsEvent,
      );
    }
  };

  fireSearchResultEvents = (eventName: string, eventData: Object) => {
    const { createAnalyticsEvent, searchSessionId } = this.props;
    if (eventName === QS_ANALYTICS_EV_SUBMIT) {
      this.fireSearchResultSelectedEvent(
        eventData as SelectedSearchResultEvent,
      );
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
          value={this.state.query}
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
