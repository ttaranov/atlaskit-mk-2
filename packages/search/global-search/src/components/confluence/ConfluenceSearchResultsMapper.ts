import { Result, ResultsGroup, ConfluenceResultsMap } from '../../model/Result';
import { take } from '../SearchResultsUtil';

export const MAX_PAGES_BLOGS_ATTACHMENTS = 8;
export const MAX_SPACES = 3;
export const MAX_PEOPLE = 3;
const MAX_RECENT_PAGES = 8;

export const mapRecentResultsToUIGroups = (
  recentlyViewedObjects: ConfluenceResultsMap,
): ResultsGroup[] => {
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

export const mapSearchResultsToUIGroups = (
  searchResultsObjects: ConfluenceResultsMap,
): ResultsGroup[] => {
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
