import * as React from 'react';
import { Result } from '../../model/Result';
import { ScreenCounter } from '../../util/ScreenCounter';
import { FormattedMessage } from 'react-intl';
import { take } from '../SearchResultsUtil';
import ResultGroup from '../ResultGroup';
import { PreQueryAnalyticsComponent } from './ScreenAnalyticsHelper';
import AdvancedSearchGroup from './AdvancedSearchGroup';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';

const MAX_RECENT_PAGES = 8;
const MAX_SPACES = 3;
const MAX_PEOPLE = 3;

export interface Props {
  query: string;
  recentlyViewedPages: Result[];
  recentlyViewedSpaces: Result[];
  recentlyInteractedPeople: Result[];
  searchSessionId: string;
  screenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
}

export default class RecentActivities extends React.Component<Props> {
  render() {
    const {
      query,
      recentlyViewedPages,
      recentlyViewedSpaces,
      recentlyInteractedPeople,
      searchSessionId,
      screenCounter,
      referralContextIdentifiers,
    } = this.props;

    let sectionIndex = 0;

    const recentPagesToShow = take(recentlyViewedPages, MAX_RECENT_PAGES);
    const recentSpacesToShow = take(recentlyViewedSpaces, MAX_SPACES);
    const recentPeopleToShow = take(recentlyInteractedPeople, MAX_PEOPLE);

    const analyticsData = {
      resultCount:
        recentPagesToShow.length +
        recentSpacesToShow.length +
        recentPeopleToShow.length,
    };

    const objectsGroup = (
      <ResultGroup
        key="objects"
        title={
          <FormattedMessage id="global-search.confluence.recent-pages-heading" />
        }
        results={recentPagesToShow}
        sectionIndex={sectionIndex}
        analyticsData={analyticsData}
      />
    );

    if (recentlyViewedPages.length > 0) {
      sectionIndex++;
    }

    const spacesGroup = (
      <ResultGroup
        key="spaces"
        title={
          <FormattedMessage id="global-search.confluence.recent-spaces-heading" />
        }
        results={recentSpacesToShow}
        sectionIndex={sectionIndex}
        analyticsData={analyticsData}
      />
    );

    if (recentlyViewedSpaces.length > 0) {
      sectionIndex++;
    }

    const peopleGroup = (
      <ResultGroup
        key="people"
        title={
          <FormattedMessage id="global-search.people.recent-people-heading" />
        }
        results={recentPeopleToShow}
        sectionIndex={sectionIndex}
        analyticsData={analyticsData}
      />
    );

    return [
      objectsGroup,
      spacesGroup,
      peopleGroup,
      <AdvancedSearchGroup key="advanced" query={query} />,
      <PreQueryAnalyticsComponent
        key="pre-query-analytics"
        screenCounter={screenCounter}
        searchSessionId={searchSessionId}
        referralContextIdentifiers={referralContextIdentifiers}
      />,
    ];
  }
}
