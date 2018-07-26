import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Result } from '../../model/Result';
import { ScreenCounter } from './ConfluenceSearchResults';
import { take } from '../SearchResultsUtil';
import ResultsGroup from '../ResultGroup';
import AnalyticsEventFiredOnMount from '../analytics/AnalyticsEventFiredOnMount';
import { buildScreenEvent, Screen } from '../../util/analytics-util';
import AdvancedSearchGroup from './AdvancedSearchGroup';

export const MAX_PAGES_BLOGS_ATTACHMENTS = 8;
export const MAX_SPACES = 3;
export const MAX_PEOPLE = 3;

export interface Props {
  query: string;
  objectResults: Result[];
  spaceResults: Result[];
  peopleResults: Result[];
  searchSessionId: string;
  screenCounter?: ScreenCounter;
}

export default class SearchResultsState extends React.Component<Props> {
  render() {
    const {
      query,
      objectResults,
      spaceResults,
      peopleResults,
      searchSessionId,
      screenCounter,
    } = this.props;

    let sectionIndex = 0;

    const renderedObjectsGroup = (
      <ResultsGroup
        key="objects"
        title={
          <FormattedMessage id="global-search.confluence.confluence-objects-heading" />
        }
        results={take(objectResults, MAX_PAGES_BLOGS_ATTACHMENTS)}
        sectionIndex={sectionIndex}
      />
    );

    if (renderedObjectsGroup !== null) {
      sectionIndex++;
    }

    const renderedSpacesGroup = (
      <ResultsGroup
        key="spaces"
        title={
          <FormattedMessage id="global-search.confluence.spaces-heading" />
        }
        results={take(spaceResults, MAX_SPACES)}
        sectionIndex={sectionIndex}
      />
    );

    if (renderedSpacesGroup !== null) {
      sectionIndex++;
    }

    const renderedPeopleGroup = (
      <ResultsGroup
        key="people"
        title={<FormattedMessage id="global-search.people.people-heading" />}
        results={take(peopleResults, MAX_PEOPLE)}
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
