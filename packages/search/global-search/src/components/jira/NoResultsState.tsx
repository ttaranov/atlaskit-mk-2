import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import NoResults from '../NoResults';
import { ResultItemGroup } from '@atlaskit/quick-search';
import JiraAdvancedSearch from './JiraAdvancedSearch';

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

    return (
      <>
        <NoResults
          key="no-results"
          title={<FormattedMessage id="global-search.jira.no-results-title" />}
          body={<FormattedMessage id="global-search.jira.no-results-body" />}
        />
        <ResultItemGroup title="" key="advanced-search">
          <Container>
            <JiraAdvancedSearch
              query={query}
              analyticsData={{ resultsCount: 0, wasOnNoResultsScreen: true }}
            />
          </Container>
        </ResultItemGroup>
      </>
    );
  }
}
