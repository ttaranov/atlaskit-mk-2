import * as React from 'react';
import Icon from '@atlaskit/icon';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';
import { messages } from '../../messages';
import StickyFooter from '../common/StickyFooter';
import SearchPeopleItem from '../SearchPeopleItem';
import SearchConfluenceItem from '../SearchConfluenceItem';
import PeopleIconGlyph from '../../assets/PeopleIconGlyph';

const PeopleSearchWrapper = styled.div`
  margin-top: ${math.multiply(gridSize, 3)}px;
`;

export interface Props {
  query: string;
  analyticsData?: object;
}

export default class AdvancedSearchGroup extends React.Component<Props> {
  render() {
    const { query, analyticsData } = this.props;
    const text =
      query.length === 0 ? (
        <FormattedMessage {...messages.confluence_advanced_search} />
      ) : (
        <FormattedMessage
          {...messages.confluence_advanced_search_for}
          values={{ query }}
        />
      );

    return [
      <PeopleSearchWrapper key="people-search">
        <SearchPeopleItem
          analyticsData={analyticsData}
          query={query}
          text={<FormattedMessage {...messages.people_advanced_search} />}
          icon={
            <Icon glyph={PeopleIconGlyph} size="medium" label="Search people" />
          }
        />
      </PeopleSearchWrapper>,
      <StickyFooter key="advanced-search">
        <SearchConfluenceItem
          analyticsData={analyticsData}
          query={query}
          text={text}
          icon={<SearchIcon size="medium" label="Advanced search" />}
          showKeyboardLozenge={true}
        />
      </StickyFooter>,
    ];
  }
}
