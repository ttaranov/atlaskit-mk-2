import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withAnalytics } from '@atlaskit/analytics';
import { CreateAnalyticsEventFn } from '../analytics/types';
import { JiraClient } from '../../api/JiraClient';
import { LinkComponent } from '../GlobalQuickSearchWrapper';
import QuickSearchContainer from '../common/QuickSearchContainer';
import JiraSearchResults from './JiraSearchResults';
export interface Props {
  createAnalyticsEvent?: CreateAnalyticsEventFn;
  linkComponent?: LinkComponent;
  jiraClient: JiraClient;
}
import { ContentType, JiraObjectResult } from '../../model/Result';

const contentTypeToSection = {
  [ContentType.JiraIssue]: 'issues',
  [ContentType.JiraBoard]: 'boards',
  [ContentType.JiraFilter]: 'filters',
  [ContentType.JiraProject]: 'projects',
};

export interface State {}

/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class JiraQuickSearchContainer extends React.Component<
  Props & InjectedIntlProps,
  State
> {
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
    return (
      <JiraSearchResults
        retrySearch={retrySearch}
        query={latestSearchQuery}
        isError={isError}
        searchResults={searchResults}
        isLoading={isLoading}
        recentItems={recentItems}
        keepPreQueryState={keepPreQueryState}
        searchSessionId={searchSessionId}
      />
    );
  };
  getRecentItems = (sessionId: string) => {
    const { jiraClient } = this.props;
    return jiraClient
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
          {},
        ),
      )
      .then(results => ({ results }));
  };

  getSearchResults = (query: string, sessionId: string, startTime: number) =>
    Promise.resolve({
      results: {},
    });

  render() {
    const { linkComponent, createAnalyticsEvent } = this.props;

    return (
      <QuickSearchContainer
        placeholder={this.props.intl.formatMessage({
          id: 'global-search.jira.search-placeholder',
        })}
        linkComponent={linkComponent}
        getDisplayedResults={({ issues, boards, projects, filters }) => {
          return [issues, ...[boards, projects, filters]];
        }}
        getSearchResultsComponent={this.getSearchResultsComponent}
        getRecentItems={this.getRecentItems}
        getSearchResults={this.getSearchResults}
        createAnalyticsEvent={createAnalyticsEvent}
      />
    );
  }
}

export default injectIntl<Props>(
  withAnalytics(JiraQuickSearchContainer, {}, {}),
);
