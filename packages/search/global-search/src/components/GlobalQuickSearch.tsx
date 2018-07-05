import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import * as debounce from 'lodash.debounce';
import { QuickSearch } from '@atlaskit/quick-search';
import { LinkComponent } from './GlobalQuickSearchWrapper';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import {
  withAnalyticsEvents,
  AnalyticsContext,
} from '@atlaskit/analytics-next';

import {
  DEFAULT_GAS_ATTRIBUTES,
  DEFAULT_GAS_SOURCE,
  DEFAULT_GAS_CHANNEL,
  sanitizeSearchQuery,
} from '../util/analytics-util';

export interface Props {
  onMount();
  onSearch(query: string);
  onSearchSubmit?();

  isLoading: boolean;
  query: string;
  searchSessionId: string;
  children: React.ReactNode;
  linkComponent?: LinkComponent;
  createAnalyticsEvent?: Function;
}

/**
 * Presentational component that renders the search input and search results.
 */
export class GlobalQuickSearch extends React.Component<
  Props & InjectedIntlProps
> {
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

  render() {
    const {
      query,
      isLoading,
      linkComponent,
      children,
      onSearchSubmit,
    } = this.props;

    return (
      <AnalyticsContext data={{ searchSessionId: this.props.searchSessionId }}>
        <QuickSearch
          isLoading={isLoading}
          onSearchInput={this.handleSearchInput}
          value={query}
          placeholder={this.props.intl.formatMessage({
            id: 'global-search.search-input-placeholder',
          })}
          linkComponent={linkComponent}
          onSearchSubmit={onSearchSubmit}
        >
          {children}
        </QuickSearch>
      </AnalyticsContext>
    );
  }
}

export default injectIntl(withAnalyticsEvents()(GlobalQuickSearch));
