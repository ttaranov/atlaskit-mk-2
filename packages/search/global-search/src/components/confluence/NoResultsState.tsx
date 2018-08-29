import * as React from 'react';
import Icon from '@atlaskit/icon';
import { ResultItemGroup } from '@atlaskit/quick-search';
import { FormattedMessage } from 'react-intl';
import SearchIcon from '@atlaskit/icon/glyph/search';
import NoResults from '../NoResults';
import SearchConfluenceItem from '../SearchConfluenceItem';
import SearchPeopleItem from '../SearchPeopleItem';
import PeopleIconGlyph from '../../assets/PeopleIconGlyph';
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
        <SearchConfluenceItem
          query={query}
          text={
            <FormattedMessage id="global-search.confluence.advanced-search-filters" />
          }
          icon={<SearchIcon size="medium" label="Advanced search" />}
          showKeyboardLozenge={true}
        />
        <SearchPeopleItem
          query={query}
          text={<FormattedMessage id="global-search.people.advanced-search" />}
          icon={
            <Icon glyph={PeopleIconGlyph} size="medium" label="Search people" />
          }
        />
      </ResultItemGroup>,
    ];
  }
}
