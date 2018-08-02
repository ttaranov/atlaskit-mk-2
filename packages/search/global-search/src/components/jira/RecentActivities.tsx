import * as React from 'react';
import { Result } from '../../model/Result';
import { ScreenCounter } from './JiraSearchResults';
import { FormattedMessage } from 'react-intl';
import { take } from '../SearchResultsUtil';
import ResultGroup from '../ResultGroup';
import AnalyticsEventFiredOnMount from '../analytics/AnalyticsEventFiredOnMount';
import { buildScreenEvent, Screen } from '../../util/analytics-util';
import AdvancedSearchFooter from './AdvancedSearchFooter';

const MAX_OBJECTS = 8;
const MAX_CONTAINERS = 3;
const MAX_PEOPLE = 3;

export interface Props {
  query: string;
  recentObjects: Result[];
  recentContainers: Result[];
  recentlyInteractedPeople: Result[];
  searchSessionId: string;
  screenCounter?: ScreenCounter;
}

export default class RecentActivities extends React.Component<Props> {
  render() {
    const {
      query,
      recentObjects,
      recentContainers,
      recentlyInteractedPeople,
      searchSessionId,
      screenCounter,
    } = this.props;

    let sectionIndex = 0;

    const objectsGroup = (
      <ResultGroup
        key="objects"
        title={
          <FormattedMessage id="global-search.jira.recent-objects-heading" />
        }
        results={take(recentObjects, MAX_OBJECTS)}
        sectionIndex={sectionIndex}
      />
    );

    if (recentObjects.length > 0) {
      sectionIndex++;
    }

    const containersGroup = (
      <ResultGroup
        key="containers"
        title={
          <FormattedMessage id="global-search.jira.recent-containers-heading" />
        }
        results={take(recentContainers, MAX_CONTAINERS)}
        sectionIndex={sectionIndex}
      />
    );

    if (recentContainers.length > 0) {
      sectionIndex++;
    }

    const peopleGroup = (
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
      objectsGroup,
      containersGroup,
      peopleGroup,
      <AdvancedSearchFooter key="advanced" query={query} />,
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
