import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Result } from '../../model/Result';
import { ScreenCounter } from '../../util/ScreenCounter';
import { take } from '../SearchResultsUtil';
import ResultsGroup from '../ResultGroup';
import { PostQueryAnalyticsComponent } from './ScreenAnalyticsHelper';
import AdvancedSearchGroup from './AdvancedSearchGroup';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';

const MAX_PAGES_BLOGS_ATTACHMENTS = 8;
const MAX_SPACES = 3;
const MAX_PEOPLE = 3;

export interface Props {
  query: string;
  objectResults: Result[];
  spaceResults: Result[];
  peopleResults: Result[];
  searchSessionId: string;
  screenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
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
      referralContextIdentifiers,
    } = this.props;

    let sectionIndex = 0;

    const objectResultsToShow = take(
      objectResults,
      MAX_PAGES_BLOGS_ATTACHMENTS,
    );
    const spaceResultsToShow = take(spaceResults, MAX_SPACES);
    const peopleResultsToShow = take(peopleResults, MAX_PEOPLE);

    const analyticsData = {
      resultCount:
        objectResultsToShow.length +
        spaceResultsToShow.length +
        peopleResultsToShow.length,
    };

    const objectsGroup = (
      <ResultsGroup
        key="objects"
        title={
          <FormattedMessage id="global-search.confluence.confluence-objects-heading" />
        }
        results={objectResultsToShow}
        sectionIndex={sectionIndex}
        analyticsData={analyticsData}
      />
    );

    if (objectResults.length > 0) {
      sectionIndex++;
    }

    const spacesGroup = (
      <ResultsGroup
        key="spaces"
        title={
          <FormattedMessage id="global-search.confluence.spaces-heading" />
        }
        results={spaceResultsToShow}
        sectionIndex={sectionIndex}
        analyticsData={analyticsData}
      />
    );

    if (spaceResults.length > 0) {
      sectionIndex++;
    }

    const peopleGroup = (
      <ResultsGroup
        key="people"
        title={<FormattedMessage id="global-search.people.people-heading" />}
        results={peopleResultsToShow}
        sectionIndex={sectionIndex}
        analyticsData={analyticsData}
      />
    );

    return [
      objectsGroup,
      spacesGroup,
      peopleGroup,
      <AdvancedSearchGroup key="advanced" query={query} />,
      <PostQueryAnalyticsComponent
        key="post-query-analytics"
        screenCounter={screenCounter}
        searchSessionId={searchSessionId}
        referralContextIdentifiers={referralContextIdentifiers}
      />,
    ];
  }
}
