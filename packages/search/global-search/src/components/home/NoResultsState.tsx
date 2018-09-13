import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ResultItemGroup } from '@atlaskit/quick-search';
import { ConfluenceIcon } from '@atlaskit/logo';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import NoResults from '../NoResults';
import SearchConfluenceItem from '../SearchConfluenceItem';
import SearchPeopleItem from '../SearchPeopleItem';
import SearchJiraItem from '../SearchJiraItem';

export interface Props {
  query: string;
}

export default class NoResultsState extends React.Component<Props> {
  render() {
    const { query } = this.props;
    return [
      <NoResults
        key="no-results"
        title={<FormattedMessage id="global-search.no-results-title" />}
        body={<FormattedMessage id="global-search.no-results-body" />}
      />,
      <ResultItemGroup title="" key="advanced-search">
        <SearchJiraItem query={query} />
        <SearchConfluenceItem
          query={query}
          text="Search for more Confluence pages and blogs"
          icon={<ConfluenceIcon size="medium" label="Search confluence" />}
        />
        <SearchPeopleItem
          query={query}
          text="Search for more people"
          icon={<PeopleIcon size="medium" label="Search people" />}
        />
      </ResultItemGroup>,
    ];
  }
}
