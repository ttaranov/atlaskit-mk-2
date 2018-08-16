import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withAnalytics } from '../../../../../core/analytics/src';
import { CreateAnalyticsEventFn } from '../analytics/types';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { JiraClient } from '../../api/JiraClient';
import { LinkComponent } from '../GlobalQuickSearchWrapper';
import { QuickSearchContainer } from '../common/QuickSearchContainer';
import ResultGroup from '../ResultGroup';
export interface Props {
  createAnalyticsEvent?: CreateAnalyticsEventFn;
  linkComponent?: LinkComponent;
  jiraClient: JiraClient;
}
import { ContentType, JiraObjectResult } from '../../model/Result';

const contentTypeToSection = {
  [ContentType.JiraIssue]: 'ISSUES',
  [ContentType.JiraBoard]: 'BOARDS, FILTERS AND PROJECTS',
  [ContentType.JiraFilter]: 'BOARDS, FILTERS AND PROJECTS',
  [ContentType.JiraProject]: 'BOARDS, FILTERS AND PROJECTS',
};

export interface State {}

/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class JiraQuickSearchContainer extends React.Component<
  Props & InjectedIntlProps,
  State
> {
  getSearchResultsComponent = ({ recentItems }) => {
    return (
      recentItems &&
      Object.keys(recentItems).map((key, sectionIndex) => (
        <ResultGroup
          key={key}
          title={key}
          results={recentItems[key]}
          sectionIndex={sectionIndex}
          analyticsData={{}}
        />
      ))
    );
  };
  fireShownPreQueryEvent = () => {};
  fireShownPostQueryEvent = () => {};

  getRecentItems = (sessionId: string) => {
    const { jiraClient } = this.props;
    return jiraClient.getRecentItems(sessionId).then(items =>
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
    );
  };

  getSearchResults = (query: string, sessionId: string, startTime: number) =>
    Promise.resolve({});

  render() {
    const { linkComponent } = this.props;

    return (
      <QuickSearchContainer
        intl={this.props.intl}
        linkComponent={linkComponent}
        getSearchResultsComponent={this.getSearchResultsComponent}
        fireShownPreQueryEvent={this.fireShownPreQueryEvent}
        fireShownPostQueryEvent={this.fireShownPostQueryEvent}
        getRecentItems={this.getRecentItems}
        getSearchResults={this.getSearchResults}
      />
    );
  }
}

export default injectIntl<Props>(
  withAnalyticsEvents()(withAnalytics(JiraQuickSearchContainer, {}, {})),
);
