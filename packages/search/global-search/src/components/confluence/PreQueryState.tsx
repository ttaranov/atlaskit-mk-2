import * as React from 'react';
import {
  GenericResultObject,
  ConfluenceRecentlyViewedItemsMap,
} from '../../model/Result';
import { ScreenCounter } from '../../util/ScreenCounter';
import { isEmpty, getConfluenceAdvancedSearchLink } from '../SearchResultsUtil';
import NoRecentActivity from '../NoRecentActivity';
import ConfluenceRecentActivities from './RecentActivities';
import { PreQueryAnalyticsComponent } from '../common/ScreenAnalyticsHelper';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';
import { FormattedHTMLMessage } from 'react-intl';

export interface Props {
  query: string;
  recentlyViewedObjects: GenericResultObject;
  searchSessionId: string;
  screenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
}

class ConfluenceNoRecentActivity extends React.Component {
  render() {
    return (
      <NoRecentActivity>
        <FormattedHTMLMessage
          id="global-search.no-recent-activity-body"
          values={{ url: getConfluenceAdvancedSearchLink() }}
        />
      </NoRecentActivity>
    );
  }
}

export default class PreQueryState extends React.Component<Props> {
  render() {
    const {
      recentlyViewedObjects,
      query,
      searchSessionId,
      screenCounter,
      referralContextIdentifiers,
    } = this.props;

    if (
      recentlyViewedObjects &&
      Object.keys(recentlyViewedObjects)
        .map(key => recentlyViewedObjects[key])
        .every(isEmpty)
    ) {
      return [
        <PreQueryAnalyticsComponent
          key="pre-query-analytics"
          screenCounter={screenCounter}
          searchSessionId={searchSessionId}
          referralContextIdentifiers={referralContextIdentifiers}
        />,
        <ConfluenceNoRecentActivity key="no-recent-activity" />,
      ];
    }

    return (
      <ConfluenceRecentActivities
        query={query}
        recentlyViewedObjects={
          recentlyViewedObjects as ConfluenceRecentlyViewedItemsMap
        }
        searchSessionId={searchSessionId}
        screenCounter={screenCounter}
        referralContextIdentifiers={referralContextIdentifiers}
      />
    );
  }
}
