import { expect } from 'chai';
import * as pWaitFor from 'p-wait-for';

import { customCategory, customType } from '../../../constants';
import { EmojiDescription, SearchSort } from '../../../types';
import { containsEmojiId, toEmojiId } from '../../../type-helpers';
import EmojiRepository, {
  getEmojiVariation,
} from '../../../api/EmojiRepository';

import {
  emojis as allEmojis,
  newEmojiRepository,
  openMouthEmoji,
  searchableEmojis,
  standardEmojis,
  smileyEmoji,
  thumbsupEmoji,
  thumbsdownEmoji,
} from '../_test-data';

function checkOrder(expected, actual) {
  expect(actual.length, `${actual.length} emojis`).to.equal(expected.length);
  expected.forEach((emoji, idx) => {
    expect(emoji.id, `emoji #${idx}`).to.equal(actual[idx].id);
  });
}

const cowboy: EmojiDescription = {
  id: '1f920',
  name: 'face with cowboy hat',
  shortName: ':cowboy:',
  type: 'STANDARD',
  category: 'PEOPLE',
  order: 10103,
  representation: {
    sprite: {
      url:
        'https://pf-emoji-service--cdn.domain.dev.atlassian.io/standard/6ba7377a-fbd4-4efe-8dbc-f025cfb40c2b/32x32/people.png',
      row: 23,
      column: 25,
      height: 782,
      width: 850,
    },
    x: 646,
    y: 714,
    height: 32,
    width: 32,
    xIndex: 19,
    yIndex: 21,
  },
  searchable: true,
};

const siteTest: EmojiDescription = {
  id: '1f921',
  name: 'collision symbol',
  shortName: ':test:',
  type: customType,
  category: customCategory,
  representation: {
    sprite: {
      url:
        'https://pf-emoji-service--cdn.domain.dev.atlassian.io/standard/6ba7377a-fbd4-4efe-8dbc-f025cfb40c2b/32x32/people.png',
      row: 23,
      column: 25,
      height: 782,
      width: 850,
    },
    x: 646,
    y: 714,
    height: 32,
    width: 32,
    xIndex: 19,
    yIndex: 21,
  },
  searchable: true,
};

const atlassianTest: EmojiDescription = {
  id: '1f922',
  name: 'boom',
  shortName: ':test:',
  type: 'ATLASSIAN',
  category: 'SYMBOL',
  representation: {
    sprite: {
      url:
        'https://pf-emoji-service--cdn.domain.dev.atlassian.io/standard/6ba7377a-fbd4-4efe-8dbc-f025cfb40c2b/32x32/people.png',
      row: 23,
      column: 25,
      height: 782,
      width: 850,
    },
    x: 646,
    y: 714,
    height: 32,
    width: 32,
    xIndex: 19,
    yIndex: 21,
  },
  searchable: true,
};

const standardTest: EmojiDescription = {
  id: '1f923',
  name: 'BOOM',
  shortName: ':test1:',
  type: 'STANDARD',
  category: 'SYMBOL',
  representation: {
    sprite: {
      url:
        'https://pf-emoji-service--cdn.domain.dev.atlassian.io/standard/6ba7377a-fbd4-4efe-8dbc-f025cfb40c2b/32x32/people.png',
      row: 23,
      column: 25,
      height: 782,
      width: 850,
    },
    x: 646,
    y: 714,
    height: 32,
    width: 32,
    xIndex: 19,
    yIndex: 21,
  },
  searchable: true,
};

const allNumberTest: EmojiDescription = {
  id: '1f43c',
  name: 'panda face',
  shortName: ':420:',
  type: 'STANDARD',
  category: 'NATURE',
  representation: {
    sprite: {
      url:
        'https://pf-emoji-service--cdn.domain.dev.atlassian.io/standard/551c9814-1d37-4573-819d-afab3afeaf32/32x32/nature.png',
      row: 23,
      column: 25,
      height: 782,
      width: 850,
    },
    x: 238,
    y: 0,
    height: 32,
    width: 32,
    xIndex: 7,
    yIndex: 0,
  },
  searchable: true,
};

const frequentTest: EmojiDescription = {
  id: '1f43c',
  name: 'panda face',
  shortName: ':panda:',
  type: 'FREQUENT',
  category: 'FREQUENT',
  representation: {
    sprite: {
      url:
        'https://pf-emoji-service--cdn.domain.dev.atlassian.io/standard/551c9814-1d37-4573-819d-afab3afeaf32/32x32/nature.png',
      row: 23,
      column: 25,
      height: 782,
      width: 850,
    },
    x: 238,
    y: 0,
    height: 32,
    width: 32,
    xIndex: 7,
    yIndex: 0,
  },
  searchable: true,
};

describe('EmojiRepository', () => {
  let emojiRepository;

  beforeEach(() => {
    // emojiRepository has state that can influence search results so make it fresh for each test.
    emojiRepository = newEmojiRepository();
  });

  describe('#search', () => {
    it('all', () => {
      const expectedEmojis = [
        ...searchableEmojis.slice(0, 10), // upto flag,
        cowboy,
        ...searchableEmojis.slice(10), // rest...
      ];
      const repository = new EmojiRepository(expectedEmojis);
      const emojis = repository.all().emojis;
      checkOrder(expectedEmojis, emojis);
    });

    it('all should not include non-searchable emoji', () => {
      const emojis = emojiRepository.all().emojis;

      expect(emojis.length).to.be.greaterThan(0);
      expect(
        emojis.filter(emoji => emoji.shortName === ':police_officer:').length,
      ).to.equal(0);
    });

    it('search all - colon style', () => {
      const expectedEmojis = [
        ...searchableEmojis.slice(0, 10), // upto flag,
        cowboy,
        ...searchableEmojis.slice(10), // rest...
      ];
      const repository = new EmojiRepository(expectedEmojis);
      const emojis = repository.search(':', { sort: SearchSort.None }).emojis;
      checkOrder(expectedEmojis, emojis);
    });

    it('no categories repeat', () => {
      const emojis = emojiRepository.all().emojis;
      const foundCategories = new Set<string>();
      let lastCategory: string;

      emojis.forEach(emoji => {
        if (emoji.category !== lastCategory) {
          expect(
            foundCategories.has(emoji.category),
            'New category not found before',
          ).to.equal(false);
          lastCategory = emoji.category;
        }
      });
    });

    it('returns frequently used before others except for an exact shortname match', done => {
      const greenHeart = emojiRepository.findByShortName(':green_heart:');
      const heart = emojiRepository.findByShortName(':heart:');

      if (!greenHeart || !heart) {
        fail(
          'The emoji needed for this test were not found in the EmojiRepository',
        );
        done();
      } else {
        const result: EmojiDescription[] = emojiRepository.search(':hear')
          .emojis;
        let heartIndex = result.indexOf(heart);
        let greenHeartIndex = result.indexOf(greenHeart);

        expect(heartIndex).to.not.equal(-1);
        expect(greenHeartIndex).to.not.equal(-1);
        expect(heartIndex < greenHeartIndex).to.equal(true);

        emojiRepository.used(greenHeart);

        // usage is recorded asynchronously so give it a chance to happen by running the asserts with setTimeout
        setTimeout(() => {
          const nextResult: EmojiDescription[] = emojiRepository.search(':hear')
            .emojis;
          heartIndex = nextResult.indexOf(heart);
          greenHeartIndex = nextResult.indexOf(greenHeart);

          expect(heartIndex).to.not.equal(-1);
          expect(greenHeartIndex).to.not.equal(-1);
          expect(greenHeartIndex < heartIndex).to.equal(true);

          // exact matching shortname should come above usage
          const exactMatchResult: EmojiDescription[] = emojiRepository.search(
            ':heart:',
          ).emojis;
          expect(
            exactMatchResult.indexOf(heart) <
              exactMatchResult.indexOf(greenHeart),
          ).to.equal(true);
          done();
        });
      }
    });

    it('returns exact matches first', () => {
      const firstEmoji = emojiRepository.search(':grin').emojis[0];
      expect(firstEmoji.shortName).to.equal(':grin:');
    });

    it('conflicting shortName matches show in type order Site -> Atlassian -> Standard', () => {
      const splitCategoryEmojis = [
        ...searchableEmojis.slice(0, 10), // upto flag,
        atlassianTest,
        standardTest,
        siteTest,
        ...searchableEmojis.slice(10), // rest...
      ];
      const repository = new EmojiRepository(splitCategoryEmojis);
      const emojis = repository.search(':test').emojis;
      const expectedEmoji = [siteTest, atlassianTest, standardTest];
      checkOrder(expectedEmoji, emojis);
    });

    it('thumbsup emojis appears before thumbs down', () => {
      const emojis = emojiRepository.search(':thumbs').emojis;
      const expectedEmoji = [thumbsupEmoji, thumbsdownEmoji];
      checkOrder(expectedEmoji, emojis);
    });

    it('options - limit ignored if missing', () => {
      const emojis = emojiRepository.search('', { sort: SearchSort.None })
        .emojis;
      checkOrder(searchableEmojis, emojis);
    });

    it('options - limit results', () => {
      const emojis = emojiRepository.search('', {
        limit: 10,
        sort: SearchSort.None,
      }).emojis;
      checkOrder(searchableEmojis.slice(0, 10), emojis);
    });

    it('includes ascii match at the top', () => {
      const emojis = emojiRepository.search(':O').emojis;
      expect(emojis[0]).to.equal(openMouthEmoji);
    });

    it('de-dupes ascii match from other matches', () => {
      const emojis = emojiRepository.search(':O').emojis;
      const openMouthEmojiCount = emojis.filter(e => e.id === openMouthEmoji.id)
        .length;
      expect(
        openMouthEmojiCount,
        'emoji matching ascii representation is only returned once in the search results',
      ).to.equal(1);
    });

    it('minus not indexed', () => {
      const emojis = emojiRepository.search(':congo').emojis;
      expect(emojis.length, 'One emoji').to.equal(1);
      expect(emojis[0].name).to.equal('Congo - Brazzaville');
      const noEmojis = emojiRepository.search(':-').emojis;
      expect(noEmojis.length, 'No emoji').to.equal(0);
    });

    it('returns emojis whose shortName starts with a number', () => {
      const expectedEmojis = [...searchableEmojis, allNumberTest];
      const repository = new EmojiRepository(expectedEmojis);
      const emojis = repository.search(':4').emojis;
      expect(emojis.length, 'One emoji').to.equal(1);
      expect(emojis[0].name).to.equal('panda face');
    });

    it('should include numbers as a part of the query', () => {
      const expectedEmojis = [...searchableEmojis, atlassianTest, standardTest];
      const repository = new EmojiRepository(expectedEmojis);
      const emojis = repository.search(':test1').emojis;
      expect(emojis.length, 'One emoji').to.equal(1);
      expect(emojis[0].name).to.equal('BOOM');
    });

    it('should not find a non-searchable emoji', () => {
      // ensure :police_officer: is present
      const policeEmoji = emojiRepository.findByShortName(':police_officer:');
      expect(
        policeEmoji === undefined,
        'A :police_officer: emoji is expected in the repository',
      ).to.equal(false);

      const emojis = emojiRepository.search(':police_officer:').emojis;
      expect(
        emojis.length,
        'The :police_officer: emoji should not be returned by a search',
      ).to.equal(0);
    });
  });

  describe('#addUnknownEmoji', () => {
    it('add custom emoji', () => {
      const siteEmojiId = toEmojiId(siteTest);
      const repository = new EmojiRepository(allEmojis);
      repository.addUnknownEmoji(siteTest);
      const searchEmojis = repository.search('').emojis;
      expect(searchEmojis.length, 'Extra emoji in results').to.equal(
        searchableEmojis.length + 1,
      );
      expect(
        containsEmojiId(searchEmojis, siteEmojiId),
        'Contains site emoji',
      ).to.equal(true);

      expect(repository.findById(siteEmojiId.id as string)).to.be.deep.equal(
        siteTest,
      );
      expect(
        repository.findByShortName(siteEmojiId.shortName),
      ).to.be.deep.equal(siteTest);
    });

    it('add custom category when the first custom emoji is added', () => {
      const repository = new EmojiRepository(standardEmojis);

      expect(repository.getDynamicCategoryList()).to.not.contain(
        customCategory,
      ); // no custom emojis in the repository yet

      repository.addUnknownEmoji(siteTest);

      expect(repository.getDynamicCategoryList()).to.contain(customCategory);
    });

    it('add non-custom emoji', () => {
      const standardTest = allEmojis[0];
      const repository = new EmojiRepository(allEmojis.slice(1));
      const numSearchable = repository.search('').emojis.length;
      repository.addUnknownEmoji(standardTest);
      const searchEmojis = repository.search('').emojis;
      expect(searchEmojis.length, 'All emojis in results').to.equal(
        numSearchable + 1,
      );
      expect(containsEmojiId(searchEmojis, toEmojiId(standardTest))).to.equal(
        true,
      );

      expect(repository.findById(standardTest.id as string)).to.be.deep.equal(
        standardTest,
      );
      expect(
        repository.findByShortName(standardTest.shortName),
      ).to.be.deep.equal(standardTest);
    });
  });

  describe('#findByAsciiRepresentation', () => {
    it('returns the correct emoji for a matching ascii representation', () => {
      const emoji = emojiRepository.findByAsciiRepresentation(':D');
      expect(emoji).to.be.deep.equal(smileyEmoji);
    });

    it('returns the correct emoji for alternative ascii representation', () => {
      const emoji = emojiRepository.findByAsciiRepresentation('=D');
      expect(emoji).to.be.deep.equal(smileyEmoji);
    });

    it('returns undefined when there is no matching ascii representation', () => {
      const emoji = emojiRepository.findByAsciiRepresentation('not-ascii');
      expect(emoji).to.equal(undefined);
    });
  });

  describe('#findAllMatchingShortName', () => {
    it('returns a list of emoji with exact match in shortName', () => {
      const repository = new EmojiRepository([
        ...allEmojis,
        siteTest,
        atlassianTest,
      ]);
      expect(repository.findAllMatchingShortName(':test:')).to.deep.equal([
        siteTest,
        atlassianTest,
      ]);
    });

    it('returns an empty list if no emoji shortNames match', () => {
      const repository = new EmojiRepository(allEmojis);
      expect(repository.findAllMatchingShortName(':test:')).to.deep.equal([]);
    });

    it('does not partially match on shortname', () => {
      const repository = new EmojiRepository([...allEmojis, standardTest]);
      expect(repository.findAllMatchingShortName(':test:')).to.deep.equal([]);
    });
  });

  describe('#delete', () => {
    let copyEmojis;
    beforeEach(() => {
      // Deep copy emoji list
      copyEmojis = JSON.parse(JSON.stringify(allEmojis));
    });

    it('should not be able to search by shortname for an emoji that has been deleted', () => {
      const repository = new EmojiRepository(copyEmojis);
      const numSmileys = repository.search(':smiley').emojis.length;
      repository.delete(smileyEmoji);
      expect(
        repository.search(':smiley').emojis.length,
        'One less smiley',
      ).to.equal(numSmileys - 1);
    });

    it('should not be able to search by ascii for an emoji that has been deleted', () => {
      const repository = new EmojiRepository(copyEmojis);
      const numSmileys = repository.search(':D').emojis.length;
      repository.delete(smileyEmoji);
      expect(repository.search(':D').emojis.length, 'One less smiley').to.equal(
        numSmileys - 1,
      );
    });

    it('should not be able to find by shortname for an emoji that has been deleted', () => {
      const repository = new EmojiRepository(copyEmojis);
      repository.delete(smileyEmoji);
      expect(
        repository.findByShortName(smileyEmoji.shortName),
        'No smileys',
      ).to.equal(undefined);
    });

    it('should not be able to find by id for an emoji that has been deleted', () => {
      const repository = new EmojiRepository(copyEmojis);
      repository.delete(smileyEmoji);
      expect(repository.findById(smileyEmoji.id!), 'No smileys').to.equal(
        undefined,
      );
    });

    it('should not be able to find by ascii for an emoji that has been deleted', () => {
      const repository = new EmojiRepository(copyEmojis);
      repository.delete(smileyEmoji);
      smileyEmoji.ascii!.forEach(a =>
        expect(repository.findByAsciiRepresentation(a), 'No smileys').to.equal(
          undefined,
        ),
      );
    });

    it('should not be able to find by category an emoji that has been deleted', () => {
      const repository = new EmojiRepository(copyEmojis);
      repository.delete(smileyEmoji);
      const peopleEmojis = repository.findInCategory('PEOPLE');
      peopleEmojis.forEach(emoji =>
        expect(emoji.shortName).to.not.equal(smileyEmoji.shortName),
      );
    });
  });

  describe('#getDynamicCategories', () => {
    it('returns an empty list if only standard emojis', () => {
      const repository = new EmojiRepository(standardEmojis);
      expect(repository.getDynamicCategoryList()).to.deep.equal([]);
    });

    it('returns all dynamic categories present in list of stored emojis', () => {
      const allCategoryEmojis = [...allEmojis, frequentTest];
      const repository = new EmojiRepository(allCategoryEmojis);
      expect(repository.getDynamicCategoryList()).to.deep.equal([
        'ATLASSIAN',
        'CUSTOM',
        'FREQUENT',
      ]);
    });

    it('should return FREQUENT as a category if there is emoji use tracked', done => {
      const repository = new EmojiRepository(standardEmojis);
      const heart = repository.findByShortName(':heart:');

      if (!heart) {
        fail(
          'The emoji needed for this test were not found in the EmojiRepository',
        );
        done();
      } else {
        repository.used(heart);

        // usage is recorded asynchronously so give it a chance to happen by running the asserts with setTimeout
        setTimeout(() => {
          expect(repository.getDynamicCategoryList()).to.deep.equal([
            'FREQUENT',
          ]);
          done();
        });
      }
    });
  });

  describe('getEmojiVariation', () => {
    it('should return the supplied emoji if invalid skintone provided', () => {
      let variation = getEmojiVariation(thumbsupEmoji, { skinTone: 9 });
      expect(variation.shortName).to.equal(':thumbsup:');

      variation = getEmojiVariation(thumbsupEmoji, { skinTone: 0 });
      expect(variation.shortName).to.equal(':thumbsup:');
    });
  });

  describe('getFrequentlyUsed', () => {
    it('should return frequently used with the correct skin tone', done => {
      const emojiRepository = newEmojiRepository();
      emojiRepository.used(thumbsupEmoji);

      // usage is recorded asynchronously so give it a chance to happen by running the asserts with setTimeout
      setTimeout(() => {
        let emoji = emojiRepository.getFrequentlyUsed({ skinTone: 4 });
        expect(emoji).to.have.lengthOf(1);
        expect(emoji[0].shortName).to.equal(
          `${thumbsupEmoji.shortName}:skin-tone-5:`,
        );
        done();
      });
    });

    it('should return a limited number of frequently used', async () => {
      const emojiRepository = newEmojiRepository();
      emojiRepository.used(thumbsupEmoji);
      emojiRepository.used(thumbsdownEmoji);
      emojiRepository.used(smileyEmoji);
      emojiRepository.used(openMouthEmoji);

      await pWaitFor(() => emojiRepository.getFrequentlyUsed().length === 4);

      let emoji = emojiRepository.getFrequentlyUsed();
      expect(emoji).to.have.lengthOf(4);

      emoji = emojiRepository.getFrequentlyUsed({ limit: 2 });
      expect(emoji).to.have.lengthOf(2);
    });

    it('should return frequent emoji on find operations with original category', done => {
      const emojiRepository = newEmojiRepository();
      emojiRepository.used(thumbsupEmoji);

      // usage is recorded asynchronously so give it a chance to happen by running the asserts with setTimeout
      setTimeout(() => {
        const thumbsUp = emojiRepository.findByShortName(':thumbsup:');
        expect(thumbsUp!.category).to.equal('PEOPLE');

        done();
      });
    });
  });
});
