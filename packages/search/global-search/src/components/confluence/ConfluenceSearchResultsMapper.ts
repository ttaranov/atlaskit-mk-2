import { ResultsGroup, ConfluenceResultsMap } from '../../model/Result';
import { take } from '../SearchResultsUtil';

export const MAX_PAGES = 8;
export const MAX_SPACES = 3;
export const MAX_PEOPLE = 3;

const EMPTY_CONFLUENCE_RESULT = {
  people: [],
  objects: [],
  spaces: [],
};

export const sliceResults = (
  resultsMap: ConfluenceResultsMap | null,
): ConfluenceResultsMap => {
  if (!resultsMap) {
    return EMPTY_CONFLUENCE_RESULT;
  }
  const { people, objects, spaces } = resultsMap;
  return {
    objects: take(objects, MAX_PAGES),
    spaces: take(spaces, MAX_SPACES),
    people: take(people, MAX_PEOPLE),
  };
};

export const mapRecentResultsToUIGroups = (
  recentlyViewedObjects: ConfluenceResultsMap | null,
): ResultsGroup[] => {
  const { people, objects, spaces } = sliceResults(recentlyViewedObjects);

  return [
    {
      items: objects,
      key: 'objects',
      titleI18nId: 'global-search.confluence.recent-pages-heading',
    },
    {
      items: spaces,
      key: 'spaces',
      titleI18nId: 'global-search.confluence.recent-spaces-heading',
    },
    {
      items: people,
      titleI18nId: 'global-search.people.recent-people-heading',
      key: 'people',
    },
  ];
};

export const mapSearchResultsToUIGroups = (
  searchResultsObjects: ConfluenceResultsMap | null,
): ResultsGroup[] => {
  const { people, objects, spaces } = sliceResults(searchResultsObjects);
  return [
    {
      items: objects,
      key: 'objects',
      titleI18nId: 'global-search.confluence.confluence-objects-heading',
    },
    {
      items: spaces,
      key: 'spaces',
      titleI18nId: 'global-search.confluence.spaces-heading',
    },
    {
      items: people,
      titleI18nId: 'global-search.people.people-heading',
      key: 'people',
    },
  ];
};
