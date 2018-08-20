import {
  makeConfluenceObjectResult,
  makePersonResult,
  makeConfluenceContainerResult,
} from '../_test-util';
import {
  MAX_PAGES,
  MAX_PEOPLE,
  MAX_SPACES,
  mapRecentResultsToUIGroups,
  mapSearchResultsToUIGroups,
} from '../../../components/confluence/ConfluenceSearchResultsMapper';
import { ConfluenceResultsMap } from '../../../model/Result';

type TestParam = {
  desc: string;
  objectsCount: number | undefined;
  spacesCount: number | undefined;
  peopleCount: number | undefined;
};

[
  { desc: 'mapRecentResultsToUIGroups', mapper: mapRecentResultsToUIGroups },
  { desc: 'mapSearchResultsToUIGroups', mapper: mapSearchResultsToUIGroups },
].forEach(({ desc, mapper }) => {
  describe(`${desc} order and count`, () => {
    const generateResult = ({
      peopleCount,
      objectsCount,
      spacesCount,
    }): ConfluenceResultsMap => ({
      people: peopleCount && [...Array(peopleCount)].map(makePersonResult),
      objects:
        objectsCount &&
        [...Array(objectsCount)].map(makeConfluenceObjectResult),
      spaces:
        spacesCount &&
        [...Array(spacesCount)].map(makeConfluenceContainerResult),
    });

    [
      {
        desc: 'it should return 3 groups even with empty result',
        objectsCount: undefined,
        spacesCount: undefined,
        peopleCount: undefined,
      },
      {
        desc: 'it should return ui groups each with correct items',
        objectsCount: 5,
        peopleCount: 2,
        spacesCount: 2,
      },
      {
        desc: 'it should return 3 groups even with empty results',
        objectsCount: 1,
        peopleCount: 0,
        spacesCount: 0,
      },
      {
        desc: 'it should return 3 groups even with missing results',
        peopleCount: 1,
        objectsCount: undefined,
        spacesCount: 0,
      },
    ].forEach(({ desc, objectsCount, peopleCount, spacesCount }: TestParam) => {
      it(`${desc}`, () => {
        const recentResultsMap = generateResult({
          objectsCount,
          peopleCount,
          spacesCount,
        });

        const groups = mapper(recentResultsMap);
        expect(groups.length).toBe(3);
        expect(groups.map(group => group.key)).toEqual([
          'objects',
          'spaces',
          'people',
        ]);

        expect(groups.map(group => group.items.length)).toEqual([
          objectsCount || 0,
          spacesCount || 0,
          peopleCount || 0,
        ]);
      });
    });

    it('should display max results if passed results are more than max', () => {
      const recentResultsMap = generateResult({
        objectsCount: MAX_PAGES + 1,
        peopleCount: MAX_PEOPLE + 2,
        spacesCount: MAX_SPACES + 4,
      });
      const groups = mapper(recentResultsMap);
      expect(groups.map(group => group.items.length)).toEqual([
        MAX_PAGES,
        MAX_SPACES,
        MAX_PEOPLE,
      ]);
    });
  });
});
