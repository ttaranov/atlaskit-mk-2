import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withAnalytics, FireAnalyticsEvent } from '@atlaskit/analytics';
import * as uuid from 'uuid/v4';
import GlobalQuickSearch from '../GlobalQuickSearch';
import { JiraClient } from '../../api/JiraClient';
import {
  CrossProductSearchClient,
  Scope,
} from '../../api/CrossProductSearchClient';
import { Result } from '../../model/Result';
import { PeopleSearchClient } from '../../api/PeopleSearchClient';
import JiraSearchResults, {
  MAX_OBJECTS,
  MAX_CONTAINERS,
  MAX_PEOPLE,
} from './JiraSearchResults';
import { LinkComponent } from '../GlobalQuickSearchWrapper';
import { handlePromiseError } from '../SearchResultsUtil';
import {
  ShownAnalyticsAttributes,
  buildShownEventDetails,
  JiraSearchPerformanceTiming,
} from '../../util/analytics-util';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { take } from '../SearchResultsUtil';
import {
  firePreQueryShownEvent,
  firePostQueryShownEvent,
} from '../../util/analytics-event-helper';
import { CreateAnalyticsEventFn } from '../analytics/types';
import performanceNow from '../../util/performance-now';
import { ScreenCounter, SearchScreenCounter } from '../../util/ScreenCounter';

export interface Props {
  crossProductSearchClient: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
  jiraClient: JiraClient;
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
  linkComponent?: LinkComponent;
  createAnalyticsEvent?: CreateAnalyticsEventFn;
  isSendSearchTermsEnabled?: boolean;
}

export interface State {
  latestSearchQuery: string;
  searchSessionId: string;
  isLoading: boolean;
  isError: boolean;
  recentObjects: Result[];
  recentContainers: Result[];
  recentlyInteractedPeople: Result[];
  objectResults: Result[];
  containerResults: Result[];
  peopleResults: Result[];
  keepPreQueryState: boolean;
}

/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class JiraQuickSearchContainer extends React.Component<
  Props & InjectedIntlProps,
  State
> {
  screenCounters: {
    preQueryScreenCounter: ScreenCounter;
    postQueryScreenCounter: ScreenCounter;
  };

  constructor(props) {
    super(props);
    const preQueryScreenCounter = new SearchScreenCounter();
    const postQueryScreenCounter = new SearchScreenCounter();
    this.screenCounters = {
      preQueryScreenCounter,
      postQueryScreenCounter,
    };
  }

  state = {
    isLoading: false,
    isError: false,
    latestSearchQuery: '',
    searchSessionId: uuid(), // unique id for search attribution
    recentObjects: [],
    recentContainers: [],
    recentlyInteractedPeople: [],
    objectResults: [],
    containerResults: [],
    peopleResults: [],
    keepPreQueryState: true,
  };

  handleSearch = (newLatestSearchQuery: string) => {
    if (this.state.latestSearchQuery !== newLatestSearchQuery) {
      this.setState({
        latestSearchQuery: newLatestSearchQuery,
        isLoading: true,
      });
    }

    if (newLatestSearchQuery.length === 0) {
      // reset search results so that internal state between query and results stays consistent
      this.setState(
        {
          isError: false,
          isLoading: false,
          objectResults: [],
          containerResults: [],
          peopleResults: [],
          keepPreQueryState: true,
        },
        () => this.fireShownPreQueryEvent(),
      );
    } else {
      this.doSearch(newLatestSearchQuery);
    }
  };

  handleSearchSubmit = ({ target }) => {
    const query = target.value;
    // TODO rediret to jira advanced search when you press enter
    // redirectToConfluenceAdvancedSearch(query);
  };

  async searchCrossProductJira(query: string): Promise<Map<Scope, Result[]>> {
    const results = await this.props.crossProductSearchClient.search(
      query,
      this.state.searchSessionId,
      [Scope.JiraIssue, Scope.JiraBoardFilterProject],
    );
    return results;
  }

  async searchPeople(query: string): Promise<Result[]> {
    const results = await this.props.peopleSearchClient.search(query);
    return results;
  }

  // TODO extract
  handleSearchErrorAnalytics(error, source: string): void {
    const { firePrivateAnalyticsEvent } = this.props;
    if (firePrivateAnalyticsEvent) {
      try {
        firePrivateAnalyticsEvent(
          'atlassian.fabric.global-search.search-error',
          {
            name: error.name,
            message: error.message,
            source: source,
          },
        );
      } catch (error) {
        // TODO logging on error
      }
    }
  }

  handleSearchErrorAnalyticsThunk = (
    source: string,
  ): ((reason: any) => void) => error =>
    this.handleSearchErrorAnalytics(error, source);

  fireShownPreQueryEvent(requestStartTime?: number) {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      const elapsedMs: number = requestStartTime
        ? performanceNow() - requestStartTime
        : 0;

      const eventAttributes: ShownAnalyticsAttributes = buildShownEventDetails(
        take(this.state.recentObjects, MAX_OBJECTS),
        take(this.state.recentContainers, MAX_CONTAINERS),
        take(this.state.recentlyInteractedPeople, MAX_PEOPLE),
      );

      firePreQueryShownEvent(
        eventAttributes,
        elapsedMs,
        this.state.searchSessionId,
        createAnalyticsEvent,
      );
    }
  }

  fireShownPostQueryEvent(
    searchPerformanceTiming: JiraSearchPerformanceTiming,
    resultsDetails: ShownAnalyticsAttributes,
  ) {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      firePostQueryShownEvent(
        resultsDetails,
        searchPerformanceTiming,
        this.state.searchSessionId,
        this.state.latestSearchQuery,
        createAnalyticsEvent,
      );
    }
  }

  doSearch = async (query: string) => {
    const startTime: number = performanceNow();

    this.setState({
      isLoading: true,
    });

    const jiraXpSearchPromise = this.searchCrossProductJira(query).catch(
      error => {
        this.handleSearchErrorAnalytics(error, 'xpsearch-jira');
        // rethrow to fail the promise
        throw error;
      },
    );

    const searchPeoplePromise = handlePromiseError(
      this.searchPeople(query),
      [],
      this.handleSearchErrorAnalyticsThunk('search-people'),
    );

    const mapPromiseToPerformanceTime = p =>
      p.then(() => performanceNow() - startTime);

    const timingPromise = [jiraXpSearchPromise, searchPeoplePromise].map(
      mapPromiseToPerformanceTime,
    );

    try {
      const [
        jiraResults,
        peopleResults,
        jiraSearchElapsedMs,
        peopleElapsedMs,
      ] = await Promise.all([
        jiraXpSearchPromise,
        searchPeoplePromise,
        ...timingPromise,
      ]);

      const elapsedMs = performanceNow() - startTime;
      if (this.state.latestSearchQuery === query) {
        this.setState(
          {
            objectResults: jiraResults.get(Scope.JiraIssue),
            containerResults:
              jiraResults.get(Scope.JiraBoardFilterProject) || [],
            peopleResults,
            isError: false,
            isLoading: false,
            keepPreQueryState: false,
          },
          () => {
            this.fireShownPostQueryEvent(
              {
                startTime,
                elapsedMs,
                jiraSearchElapsedMs,
                peopleElapsedMs,
              },
              buildShownEventDetails(
                take(this.state.objectResults, MAX_OBJECTS),
                take(this.state.containerResults, MAX_CONTAINERS),
                take(this.state.peopleResults, MAX_PEOPLE),
              ),
            );
          },
        );
      }
    } catch {
      this.setState({
        isError: true,
        isLoading: false,
        keepPreQueryState: false,
      });
    }
  };

  handleMount = async () => {
    const startTime = performanceNow();

    this.setState({
      isLoading: true,
    });

    const sessionId = this.state.searchSessionId;
    const { jiraClient, peopleSearchClient } = this.props;

    const recentActivityPromisesMap = {
      'recent-jira-objects': jiraClient.getRecentObjects(sessionId),
      'recent-jira-containers': jiraClient.getRecentContainers(sessionId),
      'recent-people': peopleSearchClient.getRecentPeople(),
    };

    const recentActivityPromises = Object.keys(recentActivityPromisesMap).map(
      key =>
        handlePromiseError(
          recentActivityPromisesMap[key],
          [],
          this.handleSearchErrorAnalyticsThunk(key),
        ),
    );

    try {
      const [
        recentObjects = [],
        recentContainers = [],
        recentlyInteractedPeople = [],
      ] = await Promise.all(recentActivityPromises);
      this.setState(
        {
          recentObjects,
          recentContainers,
          recentlyInteractedPeople,
          isLoading: false,
        },
        () => this.fireShownPreQueryEvent(startTime),
      );
    } catch {
      if (this.state.isLoading) {
        this.setState({
          isLoading: false,
        });
      }
    }
  };

  retrySearch = () => {
    this.handleSearch(this.state.latestSearchQuery);
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      Object.keys({ ...nextProps, ...this.props })
        .map(key => this.props[key] !== nextProps[key])
        .reduce((acc, value) => acc || value, false) || this.state !== nextState
    );
  }

  render() {
    const { linkComponent, isSendSearchTermsEnabled } = this.props;
    const {
      latestSearchQuery,
      isLoading,
      searchSessionId,
      isError,
      objectResults,
      containerResults,
      peopleResults,
      recentObjects,
      recentContainers,
      recentlyInteractedPeople,
      keepPreQueryState,
    } = this.state;

    return (
      <GlobalQuickSearch
        onMount={this.handleMount}
        onSearch={this.handleSearch}
        onSearchSubmit={this.handleSearchSubmit}
        isLoading={isLoading}
        placeholder={this.props.intl.formatMessage({
          id: 'global-search.jira.search-placeholder',
        })}
        linkComponent={linkComponent}
        searchSessionId={searchSessionId}
        isSendSearchTermsEnabled={isSendSearchTermsEnabled}
      >
        <JiraSearchResults
          retrySearch={this.retrySearch}
          query={latestSearchQuery}
          isError={isError}
          objectResults={objectResults}
          containerResults={containerResults}
          peopleResults={peopleResults}
          isLoading={isLoading}
          recentObjects={recentObjects}
          recentContainers={recentContainers}
          recentlyInteractedPeople={recentlyInteractedPeople}
          keepPreQueryState={keepPreQueryState}
          searchSessionId={searchSessionId}
          {...this.screenCounters}
        />
      </GlobalQuickSearch>
    );
  }
}

export default injectIntl<Props>(
  withAnalyticsEvents()(withAnalytics(JiraQuickSearchContainer, {}, {})),
);
