import * as React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { ResultItemGroup } from '@atlaskit/quick-search';
import { FormattedMessage } from 'react-intl';
import { messages } from '../../messages';
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
          title={<FormattedMessage {...messages.no_results_title} />}
          body={<FormattedMessage {...messages.no_results_body} />}
        />
        <ResultItemGroup title="" key="advanced-search">
          <Container>
            <SearchConfluenceItem
              analyticsData={analyticsData}
              isCompact
              query={query}
              text={
                <Button appearance="primary" shouldFitContainer={true}>
                  <FormattedMessage
                    {...messages.confluence_advanced_search_filters}
                  />
                </Button>
              }
            />
            <SearchPeopleItem
              analyticsData={analyticsData}
              isCompact
              query={query}
              text={
                <Button appearance="default" shouldFitContainer>
                  <FormattedMessage {...messages.people_advanced_search} />
                </Button>
              }
            />
          </Container>
        </ResultItemGroup>
      </>
    );
  }
}
