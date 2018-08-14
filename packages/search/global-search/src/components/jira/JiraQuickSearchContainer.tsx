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
import { ContentType } from '../../model/Result';

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
      Object.entries(recentItems).map(([key, items], sectionIndex) => (
        <ResultGroup
          key={key}
          title={key}
          results={items}
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
    const counts = {
      issues: 3,
      boards: 3,
      projects: 3,
      filters: 1,
    };
    return jiraClient.getRecentItems(counts, sessionId).then(items =>
      items.reduce((acc, item) => {
        const section = contentTypeToSection[item.contentType];
        acc[section] = [].concat(acc[section] || []).concat(item);
        return acc;
      }, {}),
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
