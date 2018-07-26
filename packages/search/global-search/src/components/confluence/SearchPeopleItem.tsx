import * as React from 'react';
import Icon from '@atlaskit/icon';
import { searchPeopleItem } from '../SearchResultsUtil';
import PeopleIconGlyph from '../../assets/PeopleIconGlyph';
import { FormattedMessage } from 'react-intl';

export interface Props {
  query: string;
}

export default class SearchPeopleItem extends React.Component<Props> {
  render() {
    const { query } = this.props;

    return searchPeopleItem({
      query: query,
      icon: (
        <Icon glyph={PeopleIconGlyph} size="medium" label="Search people" />
      ),
      text: <FormattedMessage id="global-search.people.advanced-search" />,
    });
  }
}
