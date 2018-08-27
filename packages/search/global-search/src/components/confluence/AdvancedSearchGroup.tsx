import * as React from 'react';
import Icon from '@atlaskit/icon';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { colors, gridSize, math } from '@atlaskit/theme';
import SearchPeopleItem from '../SearchPeopleItem';
import SearchConfluenceItem from '../SearchConfluenceItem';
import PeopleIconGlyph from '../../assets/PeopleIconGlyph';

const PeopleSearchWrapper = styled.div`
  margin-top: ${math.multiply(gridSize, 3)}px;
`;

const StickyFooter = styled.div`
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid ${colors.N40};
  padding: ${gridSize}px 0;
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
        <FormattedMessage id="global-search.confluence.advanced-search" />
      ) : (
        <FormattedMessage
          id="global-search.confluence.advanced-search-for"
          values={{ query }}
        />
      );

    return [
      <PeopleSearchWrapper key="people-search">
        <SearchPeopleItem
          analyticsData={analyticsData}
          query={query}
          text={<FormattedMessage id="global-search.people.advanced-search" />}
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
