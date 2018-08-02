import * as React from 'react';
import { Result } from '../../model/Result';
import { ScreenCounter } from './ConfluenceSearchResults';
import { isEmpty, getConfluenceAdvancedSearchLink } from '../SearchResultsUtil';
import NoRecentActivity from '../NoRecentActivity';
import RecentActivities from './RecentActivities';
import { getPreQueryAnalyticsComponent } from './ScreenAnalyticsHelper';

export interface Props {
  query: string;
  recentlyViewedPages: Result[];
  recentlyViewedSpaces: Result[];
  recentlyInteractedPeople: Result[];
  searchSessionId: string;
  screenCounter?: ScreenCounter;
}

export default class PreQueryState extends React.Component<Props> {
  render() {
    const {
      recentlyInteractedPeople,
      recentlyViewedPages,
      recentlyViewedSpaces,
      query,
      searchSessionId,
      screenCounter,
    } = this.props;

    if (
      [
        recentlyInteractedPeople,
        recentlyViewedPages,
        recentlyViewedSpaces,
      ].every(isEmpty)
    ) {
      return [
        getPreQueryAnalyticsComponent(screenCounter, searchSessionId),
        <NoRecentActivity
          key="no-recent-activity"
          advancedSearchUrl={getConfluenceAdvancedSearchLink()}
        />,
      ];
    }

    return (
      <RecentActivities
        query={query}
        recentlyViewedPages={recentlyViewedPages}
        recentlyViewedSpaces={recentlyViewedSpaces}
        recentlyInteractedPeople={recentlyInteractedPeople}
        searchSessionId={searchSessionId}
        screenCounter={screenCounter}
      />
    );
  }
}
