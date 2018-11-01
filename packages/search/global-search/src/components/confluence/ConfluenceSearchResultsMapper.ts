import { ResultsGroup, ConfluenceResultsMap } from '../../model/Result';
import { take } from '../SearchResultsUtil';
import { messages } from '../../messages';

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
      title: messages.confluence_recent_pages_heading,
    },
    {
      items: spaces,
      key: 'spaces',
      title: messages.confluence_recent_spaces_heading,
    },
    {
      items: people,
      key: 'people',
      title: messages.people_recent_people_heading,
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
      title: messages.confluence_confluence_objects_heading,
    },
    {
      items: spaces,
      key: 'spaces',
      title: messages.confluence_spaces_heading,
    },
    {
      items: people,
      key: 'people',
      title: messages.people_people_heading,
    },
  ];
};
