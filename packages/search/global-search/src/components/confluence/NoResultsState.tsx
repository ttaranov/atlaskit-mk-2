import * as React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { ResultItemGroup } from '@atlaskit/quick-search';
import { FormattedMessage } from 'react-intl';
import NoResults from '../NoResults';
import SearchConfluenceItem from '../SearchConfluenceItem';
import SearchPeopleItem from '../SearchPeopleItem';
export interface Props {
  query: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export default class NoResultsState extends React.Component<Props> {
  render() {
    const { query } = this.props;
    const analyticsData = { resultsCount: 0, wasOnNoResultsScreen: true };
    return (
      <>
        <NoResults
          key="no-results"
          title={<FormattedMessage id="global-search.no-results-title" />}
          body={<FormattedMessage id="global-search.no-results-body" />}
        />
        <ResultItemGroup title="" key="advanced-search">
          <Container>
            <SearchConfluenceItem
              analyticsData={analyticsData}
              isCompact
              query={query}
              text={
                <Button appearance="primary" shouldFitContainer={true}>
                  <FormattedMessage id="global-search.confluence.advanced-search-filters" />
                </Button>
              }
            />
            <SearchPeopleItem
              analyticsData={analyticsData}
              isCompact
              query={query}
              text={
                <Button appearance="default" shouldFitContainer>
                  <FormattedMessage id="global-search.people.advanced-search" />
                </Button>
              }
            />
          </Container>
        </ResultItemGroup>
      </>
    );
  }
}
