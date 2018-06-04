import * as React from 'react';
import * as debounce from 'lodash.debounce';
import { QuickSearch } from '@atlaskit/quick-search';
import { LinkComponent } from './GlobalQuickSearchWrapper';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

import {
  DEFAULT_GAS_ATTRIBUTES,
  DEFAULT_GAS_SOURCE,
  DEFUALT_GAS_CHANNEL,
  sanitizeSearchQuery,
} from '../util/analytics';

export interface Props {
  onMount();
  onSearch(query: string);

  isLoading: boolean;
  query: string;
  children: React.ReactNode;
  linkComponent?: LinkComponent;
  createAnalyticsEvent?: Function;
}

/**
 * Presentational component that renders the search input and search results.
 */
export class GlobalQuickSearch extends React.Component<Props> {
  queryVersion: number;

  constructor(props) {
    super(props);
    this.queryVersion = 0;
  }

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
          componentName: 'GlobalQuickSearch',
          ...DEFAULT_GAS_ATTRIBUTES,
        },
      };
      this.props.createAnalyticsEvent(payload).fire(DEFUALT_GAS_CHANNEL);
    }

    this.queryVersion++;
  }

  render() {
    const { query, isLoading, linkComponent, children } = this.props;

    return (
      <QuickSearch
        isLoading={isLoading}
        onSearchInput={this.handleSearchInput}
        value={query}
        linkComponent={linkComponent}
      >
        {children}
      </QuickSearch>
    );
  }
}

export default withAnalyticsEvents()(GlobalQuickSearch);
