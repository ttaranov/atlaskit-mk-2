import * as React from 'react';
import { ConfluenceRecentlyViewedItemsMap, Result } from '../../model/Result';
import { ScreenCounter } from '../../util/ScreenCounter';
import { take } from '../SearchResultsUtil';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';
import RecentActivities, { ResultsGroup } from '../common/RecentActivities';
const MAX_RECENT_PAGES = 8;
const MAX_SPACES = 3;
const MAX_PEOPLE = 3;

export interface Props {
  query: string;
  recentlyViewedObjects: ConfluenceRecentlyViewedItemsMap;
  searchSessionId: string;
  screenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
}

export default class ConfluenceRecentActivities extends React.Component<Props> {
  getResultsToDsiplay = (recentlyViewedObjects): ResultsGroup[] => {
    const {
      recentlyInteractedPeople,
      recentlyViewedPages,
      recentlyViewedSpaces,
    } = recentlyViewedObjects;
    const recentPagesToShow: Result[] = take(
      recentlyViewedPages,
      MAX_RECENT_PAGES,
    );
    const recentSpacesToShow: Result[] = take(recentlyViewedSpaces, MAX_SPACES);
    const recentPeopleToShow: Result[] = take(
      recentlyInteractedPeople,
      MAX_PEOPLE,
    );

    return [
      {
        items: recentPagesToShow,
        key: 'objects',
        titleI18nId: 'global-search.confluence.recent-pages-heading',
      },
      {
        items: recentSpacesToShow,
        key: 'spaces',
        titleI18nId: 'global-search.confluence.recent-spaces-heading',
      },
      {
        items: recentPeopleToShow,
        titleI18nId: 'global-search.confluence.recent-spaces-heading',
        key: 'people',
      },
    ];
  };
  render() {
    return (
      <RecentActivities
        {...this.props}
        resultsGroup={this.getResultsToDsiplay(
          this.props.recentlyViewedObjects,
        )}
      />
    );
  }
}
