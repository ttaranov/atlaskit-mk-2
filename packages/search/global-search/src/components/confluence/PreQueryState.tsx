import * as React from 'react';
import { Result } from '../../model/Result';
import { ScreenCounter } from '../../util/ScreenCounter';
import { isEmpty, getConfluenceAdvancedSearchLink } from '../SearchResultsUtil';
import NoRecentActivity from '../NoRecentActivity';
import RecentActivities from './RecentActivities';
import { PreQueryAnalyticsComponent } from './ScreenAnalyticsHelper';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';

export interface Props {
  query: string;
  recentlyViewedPages: Result[];
  recentlyViewedSpaces: Result[];
  recentlyInteractedPeople: Result[];
  searchSessionId: string;
  screenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
}

export default class PreQueryState extends React.Component<Props> {
  render() {
    debugger;
    const {
      recentlyInteractedPeople,
      recentlyViewedPages,
      recentlyViewedSpaces,
      query,
      searchSessionId,
      screenCounter,
      referralContextIdentifiers,
    } = this.props;

    if (
      [
        recentlyInteractedPeople,
        recentlyViewedPages,
        recentlyViewedSpaces,
      ].every(isEmpty)
    ) {
      return [
        <PreQueryAnalyticsComponent
          key="pre-query-analytics"
          screenCounter={screenCounter}
          searchSessionId={searchSessionId}
          referralContextIdentifiers={referralContextIdentifiers}
        />,
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
        referralContextIdentifiers={referralContextIdentifiers}
      />
    );
  }
}
