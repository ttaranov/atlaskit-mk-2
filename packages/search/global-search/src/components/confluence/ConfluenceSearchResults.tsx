import * as React from 'react';
import {
  Result,
  ResultsGroup,
  ConfluenceResultItemsMap,
} from '../../model/Result';
import { ScreenCounter } from '../../util/ScreenCounter';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';
import { take } from '../SearchResultsUtil';
import NoResultsState from './NoResultsState';
import GenericSearchResults from '../common/GenericSearchResults';
import { getConfluenceAdvancedSearchLink } from '../SearchResultsUtil';
import { FormattedHTMLMessage } from 'react-intl';
import AdvancedSearchGroup from './AdvancedSearchGroup';

export const MAX_PAGES_BLOGS_ATTACHMENTS = 8;
export const MAX_SPACES = 3;
export const MAX_PEOPLE = 3;

const MAX_RECENT_PAGES = 8;

export interface Props {
  query: string;
  isError: boolean;
  isLoading: boolean;
  retrySearch();
  recentItems: ConfluenceResultItemsMap;
  searchResults: ConfluenceResultItemsMap;
  keepPreQueryState: boolean;
  searchSessionId: string;
  preQueryScreenCounter?: ScreenCounter;
  postQueryScreenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
}

const getRecentsResultGroups = (recentlyViewedObjects): ResultsGroup[] => {
  const { people, objects, spaces } = recentlyViewedObjects;
  const recentPagesToShow: Result[] = take(objects, MAX_RECENT_PAGES);
  const recentSpacesToShow: Result[] = take(spaces, MAX_SPACES);
  const recentPeopleToShow: Result[] = take(people, MAX_PEOPLE);

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
      titleI18nId: 'global-search.people.recent-people-heading',
      key: 'people',
    },
  ];
};

const getSearchResultsGroup = (searchResultsObjects): ResultsGroup[] => {
  const { objects, spaces, people } = searchResultsObjects;

  const objectResultsToShow: Result[] = take(
    objects,
    MAX_PAGES_BLOGS_ATTACHMENTS,
  );
  const spaceResultsToShow: Result[] = take(spaces, MAX_SPACES);
  const peopleResultsToShow: Result[] = take(people, MAX_PEOPLE);

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
    const { recentItems, searchResults, query } = this.props;

    return (
      <GenericSearchResults
        {...this.props}
        renderAdvancedSearchLink={() => (
          <FormattedHTMLMessage
            id="global-search.no-recent-activity-body"
            values={{ url: getConfluenceAdvancedSearchLink() }}
          />
        )}
        renderAdvancedSearchGroup={() => (
          <AdvancedSearchGroup key="advanced" query={query} />
        )}
        getRecentlyViewedGroups={() => getRecentsResultGroups(recentItems)}
        getSearchResultsGroups={() => getSearchResultsGroup(searchResults)}
        renderNoResult={() => <NoResultsState query={query} />}
      />
    );
  }
}
