import * as React from 'react';
import {
  injectIntl,
  InjectedIntlProps,
  FormattedHTMLMessage,
} from 'react-intl';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { withAnalytics } from '@atlaskit/analytics';
import StickyFooter from '../common/StickyFooter';
import { CreateAnalyticsEventFn } from '../analytics/types';
import { SearchScreenCounter, ScreenCounter } from '../../util/ScreenCounter';
import { JiraClient } from '../../api/JiraClient';
import { PeopleSearchClient } from '../../api/PeopleSearchClient';
import { CrossProductSearchClient } from '../../api/CrossProductSearchClientV2';
import {
  LinkComponent,
  ReferralContextIdentifiers,
} from '../GlobalQuickSearchWrapper';
import QuickSearchContainer from '../common/QuickSearchContainer';
import { sliceResults } from './JiraSearchResultsMapper';
import SearchResultsComponent from '../common/SearchResults';
import NoResultsState from './NoResultsState';
import JiraAdvancedSearch from './JiraAdvancedSearch';
import {
  mapRecentResultsToUIGroups,
  mapSearchResultsToUIGroups,
  JiraScopes,
} from './JiraSearchResultsMapper';
import {
  handlePromiseError,
  JiraEntityTypes,
  redirectToJiraAdvancedSearch,
} from '../SearchResultsUtil';
import {
  ContentType,
  JiraObjectResult,
  Result,
  ResultsWithTiming,
  GenericResultMap,
  JiraResultsMap,
} from '../../model/Result';
import performanceNow from '../../util/performance-now';

const AdvancedSearchContainer = styled.div`
  margin-top: ${4 * gridSize()}px;
`;

export interface Props {
  createAnalyticsEvent?: CreateAnalyticsEventFn;
  linkComponent?: LinkComponent;
  referralContextIdentifiers?: ReferralContextIdentifiers;
  jiraClient: JiraClient;
  crossProductSearchClientV2: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
}

const contentTypeToSection = {
  [ContentType.JiraIssue]: 'issues',
  [ContentType.JiraBoard]: 'boards',
  [ContentType.JiraFilter]: 'filters',
  [ContentType.JiraProject]: 'projects',
};

export interface State {
  selectedAdvancedSearchType: JiraEntityTypes;
}

/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class JiraQuickSearchContainer extends React.Component<
  Props & InjectedIntlProps,
  State
> {
  state = {
    selectedAdvancedSearchType: JiraEntityTypes.Issues,
  };

  screenCounters = {
    preQueryScreenCounter: new SearchScreenCounter() as ScreenCounter,
    postQueryScreenCounter: new SearchScreenCounter() as ScreenCounter,
  };

  handleSearchSubmit = ({ target }) => {
    const query = target.value;
    redirectToJiraAdvancedSearch(this.state.selectedAdvancedSearchType, query);
  };

  onAdvancedSearchChange = entityType =>
    this.setState({ selectedAdvancedSearchType: entityType });

  getSearchResultsComponent = ({
    retrySearch,
    latestSearchQuery,
    isError,
    searchResults,
    isLoading,
    recentItems,
    keepPreQueryState,
    searchSessionId,
  }) => {
    const query = latestSearchQuery;
    return (
      <SearchResultsComponent
        query={query}
        isError={isError}
        isLoading={isLoading}
        retrySearch={retrySearch}
        keepPreQueryState={keepPreQueryState}
        searchSessionId={searchSessionId}
        {...this.screenCounters}
        referralContextIdentifiers={this.props.referralContextIdentifiers}
        renderNoRecentActivity={() => (
          <>
            <FormattedHTMLMessage id="global-search.jira.no-recent-activity-body" />
            <AdvancedSearchContainer>
              <JiraAdvancedSearch
                query={query}
                analyticsData={{ resultsCount: 0, wasOnNoResultsScreen: true }}
              />
            </AdvancedSearchContainer>
          </>
        )}
        renderAdvancedSearchGroup={(analyticsData?) => (
          <StickyFooter>
            <JiraAdvancedSearch
              analyticsData={analyticsData}
              query={query}
              showKeyboardLozenge
              showSearchIcon
              onAdvancedSearchChange={this.onAdvancedSearchChange}
            />
          </StickyFooter>
        )}
        getPreQueryGroups={() => mapRecentResultsToUIGroups(recentItems)}
        getPostQueryGroups={() =>
          mapSearchResultsToUIGroups(searchResults as JiraResultsMap)
        }
        renderNoResult={() => <NoResultsState query={query} />}
      />
    );
  };

  getRecentlyInteractedPeople = (): Promise<Result[]> => {
    const peoplePromise: Promise<
      Result[]
    > = this.props.peopleSearchClient.getRecentPeople();
    return handlePromiseError<Result[]>(
      peoplePromise,
      [] as Result[],
    ) as Promise<Result[]>;
  };

  getJiraRecentItems = (sessionId: string) => {
    const jiraRecentItemsPromise = this.props.jiraClient
      .getRecentItems(sessionId)
      .then(items =>
        items.reduce(
          (
            acc: { [key: string]: JiraObjectResult[] },
            item: JiraObjectResult,
          ) => {
            if (item.contentType) {
              const section = contentTypeToSection[item.contentType];
              acc[section] = ([] as JiraObjectResult[]).concat(
                acc[section] || [],
                item,
              );
            }
            return acc;
          },
          {} as GenericResultMap,
        ),
      );
    return handlePromiseError(jiraRecentItemsPromise, {
      issues: [],
      boards: [],
      filters: [],
      projects: [],
    });
  };

  getRecentItems = (sessionId: string): Promise<ResultsWithTiming> => {
    return Promise.all([
      this.getJiraRecentItems(sessionId),
      this.getRecentlyInteractedPeople(),
    ])
      .then(([jiraItems, people]) => {
        return { ...jiraItems, people };
      })
      .then(results => ({ results } as ResultsWithTiming));
  };

  getSearchResults = (
    query: string,
    sessionId: string,
    startTime: number,
  ): Promise<ResultsWithTiming> => {
    const jiraSearchPromise = this.props.crossProductSearchClientV2.search(
      query,
      JiraScopes,
      sessionId,
    );
    const poeplePromise = this.props.peopleSearchClient.search(query);

    const mapPromiseToPerformanceTime = p =>
      p.then(() => performanceNow() - startTime);

    const timingPromise = [jiraSearchPromise, poeplePromise].map(
      mapPromiseToPerformanceTime,
    );

    return Promise.all([
      poeplePromise,
      jiraSearchPromise,
      ...timingPromise,
    ]).then(
      ([people, jiraResults, jiraSearchElapsedMs, peopleSearchElapsedMs]) => ({
        results: {
          people,
          ...jiraResults.results,
        },
        timings: {
          jiraSearchElapsedMs,
          peopleSearchElapsedMs,
        },
        abTest: jiraResults.abTest,
      }),
    );
  };

  render() {
    const { linkComponent, createAnalyticsEvent } = this.props;

    return (
      <QuickSearchContainer
        placeholder={this.props.intl.formatMessage({
          id: 'global-search.jira.search-placeholder',
        })}
        linkComponent={linkComponent}
        getDisplayedResults={sliceResults}
        getSearchResultsComponent={this.getSearchResultsComponent}
        getRecentItems={this.getRecentItems}
        getSearchResults={this.getSearchResults}
        handleSearchSubmit={this.handleSearchSubmit}
        createAnalyticsEvent={createAnalyticsEvent}
      />
    );
  }
}

export default injectIntl<Props>(
  withAnalytics(JiraQuickSearchContainer, {}, {}),
);
