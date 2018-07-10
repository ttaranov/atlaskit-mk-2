import * as React from 'react';
import * as debounce from 'lodash.debounce';
import { QuickSearch } from '@atlaskit/quick-search';
import { LinkComponent } from './GlobalQuickSearchWrapper';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import {
  withAnalyticsEvents,
  AnalyticsContext,
} from '@atlaskit/analytics-next';

import { withAnalytics } from '@atlaskit/analytics';

import {
  fireSelectedSearchResult,
  fireHighlightedSearchResult,
  SelectedSearchResultEventData,
  KeyboardControlEvent,
} from '../util/analytics-event-helper';

import {
  DEFAULT_GAS_ATTRIBUTES,
  DEFAULT_GAS_SOURCE,
  DEFAULT_GAS_CHANNEL,
  sanitizeSearchQuery,
} from '../util/analytics-util';

import { CreateAnalyticsEventFn } from '../components/analytics/types';

export interface Props {
  onMount();
  onSearch(query: string);
  onSearchSubmit?();

  isLoading: boolean;
  query: string;
  searchSessionId: string;
  children: React.ReactNode;
  linkComponent?: LinkComponent;
  createAnalyticsEvent?: CreateAnalyticsEventFn;
}

/**
 * Presentational component that renders the search input and search results.
 */
export class GlobalQuickSearch extends React.Component<Props> {
  queryVersion: number = 0;

  componentDidMount() {
    this.props.onMount();
  }

  handleSearchInput = ({ target }) => {
    const query = target.value;
    this.debouncedSearch(query);
  };

  debouncedSearch = debounce(this.doSearch, 350);

  doSearch(query: string) {
    this.props.onSearch(query);

    if (this.props.createAnalyticsEvent) {
      const sanitizedQuery = sanitizeSearchQuery(query);
      const event = this.props.createAnalyticsEvent();
      const searchSessionId = this.props.searchSessionId;
      const payload: GasPayload = {
        action: 'entered',
        actionSubject: 'text',
        eventType: 'track',
        source: DEFAULT_GAS_SOURCE,
        attributes: {
          queryId: null,
          queryVersion: this.queryVersion,
          queryLength: sanitizedQuery.length,
          wordCount:
            sanitizedQuery.length > 0 ? sanitizedQuery.split(/\s/).length : 0,
          ...DEFAULT_GAS_ATTRIBUTES,
          searchSessionId: searchSessionId,
        },
      };
      event.update(payload).fire(DEFAULT_GAS_CHANNEL);
    }

    this.queryVersion++;
  }

  fireQuickSearchEvents = (
    eventName: string,
    eventData: KeyboardControlEvent | SelectedSearchResultEventData,
  ) => {
    const ATLASKIT_QUICKSEARCH_NS = 'atlaskit.navigation.quick-search';
    const QS_ANALYTICS_EV_KB_CTRLS_USED = `${ATLASKIT_QUICKSEARCH_NS}.keyboard-controls-used`;
    const QS_ANALYTICS_EV_SUBMIT = `${ATLASKIT_QUICKSEARCH_NS}.submit`;

    const { createAnalyticsEvent, searchSessionId } = this.props;
    if (createAnalyticsEvent) {
      if (eventName === QS_ANALYTICS_EV_SUBMIT) {
        // result selected
        fireSelectedSearchResult(
          eventData as SelectedSearchResultEventData,
          searchSessionId,
          createAnalyticsEvent,
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
    }
  };

  render() {
    const {
      query,
      isLoading,
      linkComponent,
      children,
      onSearchSubmit,
    } = this.props;

    const QuickSearchWithAnalytics = withAnalytics(
      QuickSearch,
      {
        firePrivateAnalyticsEvent: this.fireQuickSearchEvents,
      },
      {},
    );

    return (
      <AnalyticsContext data={{ searchSessionId: this.props.searchSessionId }}>
        <QuickSearchWithAnalytics
          isLoading={isLoading}
          onSearchInput={this.handleSearchInput}
          value={query}
          linkComponent={linkComponent}
          onSearchSubmit={onSearchSubmit}
        >
          {children}
        </QuickSearchWithAnalytics>
      </AnalyticsContext>
    );
  }
}

export default withAnalyticsEvents()(GlobalQuickSearch);
