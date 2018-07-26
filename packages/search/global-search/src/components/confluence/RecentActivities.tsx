import * as React from 'react';
import { Result } from '../../model/Result';
import { ScreenCounter } from './ConfluenceSearchResults';
import { FormattedMessage } from 'react-intl';
import { take } from '../SearchResultsUtil';
import ResultGroup from '../ResultGroup';
import AnalyticsEventFiredOnMount from '../analytics/AnalyticsEventFiredOnMount';
import { buildScreenEvent, Screen } from '../../util/analytics-util';
import AdvancedSearchGroup from './AdvancedSearchGroup';

const MAX_RECENT_PAGES = 8;
export const MAX_SPACES = 3;
export const MAX_PEOPLE = 3;

export interface Props {
  query: string;
  recentlyViewedPages: Result[];
  recentlyViewedSpaces: Result[];
  recentlyInteractedPeople: Result[];
  searchSessionId: string;
  screenCounter?: ScreenCounter;
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
    } = this.props;
    let sectionIndex = 0;

    const renderedObjectsGroup = (
      <ResultGroup
        key="objects"
        title={
          <FormattedMessage id="global-search.confluence.recent-pages-heading" />
        }
        results={take(recentlyViewedPages, MAX_RECENT_PAGES)}
        sectionIndex={sectionIndex}
      />
    );

    if (renderedObjectsGroup !== null) {
      sectionIndex++;
    }

    const renderedSpacesGroup = (
      <ResultGroup
        key="spaces"
        title={
          <FormattedMessage id="global-search.confluence.recent-spaces-heading" />
        }
        results={take(recentlyViewedSpaces, MAX_SPACES)}
        sectionIndex={sectionIndex}
      />
    );

    if (renderedSpacesGroup !== null) {
      sectionIndex++;
    }

    const renderedPeopleGroup = (
      <ResultGroup
        key="people"
        title={
          <FormattedMessage id="global-search.people.recent-people-heading" />
        }
        results={take(recentlyInteractedPeople, MAX_PEOPLE)}
        sectionIndex={sectionIndex}
      />
    );

    return [
      renderedObjectsGroup,
      renderedSpacesGroup,
      renderedPeopleGroup,
      <AdvancedSearchGroup key="advanced" query={query} />,
      screenCounter ? (
        <AnalyticsEventFiredOnMount
          key="preQueryScreenEvent"
          onEventFired={() => screenCounter.increment()}
          payloadProvider={() =>
            buildScreenEvent(
              Screen.PRE_QUERY,
              screenCounter.getCount(),
              searchSessionId,
            )
          }
        />
      ) : null,
    ];
  }
}
