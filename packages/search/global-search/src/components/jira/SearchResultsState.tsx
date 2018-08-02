import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Result } from '../../model/Result';
import { ScreenCounter } from './JiraSearchResults';
import { take } from '../SearchResultsUtil';
import ResultsGroup from '../ResultGroup';
import AnalyticsEventFiredOnMount from '../analytics/AnalyticsEventFiredOnMount';
import { buildScreenEvent, Screen } from '../../util/analytics-util';
import AdvancedSearchFooter from './AdvancedSearchFooter';

const MAX_OBJECTS = 8;
const MAX_CONTAINERS = 3;
const MAX_PEOPLE = 3;

export interface Props {
  query: string;
  objectResults: Result[];
  containerResults: Result[];
  peopleResults: Result[];
  searchSessionId: string;
  screenCounter?: ScreenCounter;
}

export default class SearchResultsState extends React.Component<Props> {
  render() {
    const {
      query,
      objectResults,
      containerResults,
      peopleResults,
      searchSessionId,
      screenCounter,
    } = this.props;

    let sectionIndex = 0;

    const objectsGroup = (
      <ResultsGroup
        key="objects"
        title={
          <FormattedMessage id="global-search.jira.jira-objects-heading" />
        }
        results={take(objectResults, MAX_OBJECTS)}
        sectionIndex={sectionIndex}
      />
    );

    if (objectResults.length > 0) {
      sectionIndex++;
    }

    const containersGroup = (
      <ResultsGroup
        key="containers"
        title={<FormattedMessage id="global-search.jira.conatiners-heading" />}
        results={take(containerResults, MAX_CONTAINERS)}
        sectionIndex={sectionIndex}
      />
    );

    if (containerResults.length > 0) {
      sectionIndex++;
    }

    const peopleGroup = (
      <ResultsGroup
        key="people"
        title={<FormattedMessage id="global-search.people.people-heading" />}
        results={take(peopleResults, MAX_PEOPLE)}
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
          key="postQueryScreenEvent"
          onEventFired={() => screenCounter.increment()}
          payloadProvider={() =>
            buildScreenEvent(
              Screen.POST_QUERY,
              screenCounter.getCount(),
              searchSessionId,
            )
          }
        />
      ) : null,
    ];
  }
}
