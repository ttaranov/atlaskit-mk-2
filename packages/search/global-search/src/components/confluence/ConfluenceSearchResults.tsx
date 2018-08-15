import * as React from 'react';
import { Result } from '../../model/Result';
import { ScreenCounter } from '../../util/ScreenCounter';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';
import { take } from '../SearchResultsUtil';
import NoResultsState from './NoResultsState';
import GenericSearchResults from '../common/GenericSearchResults';
import { ResultsGroup } from '../common/RecentActivities';
import { getConfluenceAdvancedSearchLink } from '../SearchResultsUtil';
import { FormattedHTMLMessage } from 'react-intl';

export const MAX_PAGES_BLOGS_ATTACHMENTS = 8;
export const MAX_SPACES = 3;
export const MAX_PEOPLE = 3;

const MAX_RECENT_PAGES = 8;

export interface Props {
  query: string;
  isError: boolean;
  isLoading: boolean;
  retrySearch();
  recentlyViewedPages: Result[];
  recentlyViewedSpaces: Result[];
  recentlyInteractedPeople: Result[];
  objectResults: Result[];
  spaceResults: Result[];
  peopleResults: Result[];
  keepPreQueryState: boolean;
  searchSessionId: string;
  preQueryScreenCounter?: ScreenCounter;
  postQueryScreenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
}

const getRecentsResultGroups = (recentlyViewedObjects): ResultsGroup[] => {
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

const getSearchResultsGroup = (searchResultsObjects): ResultsGroup[] => {
  const { objectResults, spaceResults, peopleResults } = searchResultsObjects;

  const objectResultsToShow: Result[] = take(
    objectResults,
    MAX_PAGES_BLOGS_ATTACHMENTS,
  );
  const spaceResultsToShow: Result[] = take(spaceResults, MAX_SPACES);
  const peopleResultsToShow: Result[] = take(peopleResults, MAX_PEOPLE);

  return [
    {
      items: objectResultsToShow,
      key: 'objects',
      titleI18nId: 'global-search.confluence.confluence-objects-heading',
    },
    {
      items: spaceResultsToShow,
      key: 'spaces',
      titleI18nId: 'global-search.confluence.spaces-heading',
    },
    {
      items: peopleResultsToShow,
      titleI18nId: 'global-search.people.people-heading',
      key: 'people',
    },
  ];
};

export default class ConfluenceSearchResults extends React.Component<Props> {
  render() {
    const {
      recentlyInteractedPeople,
      recentlyViewedPages,
      recentlyViewedSpaces,
      objectResults,
      spaceResults,
      peopleResults,
      query,
    } = this.props;

    return (
      <GenericSearchResults
        {...this.props}
        renderAdvancedSearchLink={() => (
          <FormattedHTMLMessage
            id="global-search.no-recent-activity-body"
            values={{ url: getConfluenceAdvancedSearchLink() }}
          />
        )}
        getRecentlyViewedGroups={() =>
          getRecentsResultGroups({
            recentlyInteractedPeople,
            recentlyViewedPages,
            recentlyViewedSpaces,
          })
        }
        getSearchResultsGroups={() =>
          getSearchResultsGroup({
            objectResults,
            spaceResults,
            peopleResults,
          })
        }
        renderNoResult={() => <NoResultsState query={query} />}
      />
    );
  }
}
