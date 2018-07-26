import * as React from 'react';
import { ResultItemGroup } from '@atlaskit/quick-search';
import { FormattedMessage } from 'react-intl';
import NoResults from '../NoResults';
import SearchConfluenceItem from './SearchConfluenceItem';
import SearchPeopleItem from './SearchPeopleItem';

export interface Props {
  query: string;
}

export default class NoResultsState extends React.Component<Props> {
  render() {
    const { query } = this.props;
    return [
      <NoResults key="no-results" />,
      <ResultItemGroup title="" key="advanced-search">
        <SearchConfluenceItem
          query={query}
          text={
            <FormattedMessage id="global-search.confluence.advanced-search-filters" />
          }
        />
        <SearchPeopleItem query={query} />
      </ResultItemGroup>,
    ];
  }
}
