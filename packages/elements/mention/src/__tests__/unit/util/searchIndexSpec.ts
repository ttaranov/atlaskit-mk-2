import {
  Highlighter,
  SearchIndex,
  mentionDescriptionComparator,
} from '../../../util/searchIndex';

describe('SearchIndex', () => {
  let searchIndex: SearchIndex;

  beforeEach(() => {
    searchIndex = new SearchIndex();
  });

  it('should search by first name', async () => {
    searchIndex.indexResults([
      { id: 'id', name: 'Homer Simpson', mentionName: 'mentionName' },
    ]);

    const result = await searchIndex.search('homer');
    expect(result.mentions).toHaveLength(1);
  });

  it('should search by last name', async () => {
    searchIndex.indexResults([
      { id: 'id', name: 'Homer Simpson', mentionName: 'mentionName' },
    ]);

    const result = await searchIndex.search('simpson');
    expect(result.mentions).toHaveLength(1);
  });

  it('should search by mention name', async () => {
    searchIndex.indexResults([
      { id: 'id', name: 'Homer Simpson', mentionName: 'mentionName' },
    ]);

    const result = await searchIndex.search('mention');
    expect(result.mentions).toHaveLength(1);
  });

  it('should search by nickname', async () => {
    searchIndex.indexResults([
      {
        id: 'id',
        name: 'Homer Simpson',
        mentionName: 'mentionName',
        nickname: 'donut',
      },
    ]);

    const result = await searchIndex.search('donut');
    expect(result.mentions).toHaveLength(1);
  });

  it('should search chinese characters', async () => {
    searchIndex.indexResults([
      { id: 'id', name: '我是法国人', mentionName: '法国人' },
    ]);

    const result = await searchIndex.search('国');
    expect(result.mentions).toHaveLength(1);
  });

  it('should search by token in name', async () => {
    searchIndex.indexResults([
      {
        id: 'id',
        name: 'Homer Simpson [Atlassian]',
        mentionName: 'mentionName',
      },
    ]);

    const result = await searchIndex.search('atlas');
    expect(result.mentions).toHaveLength(1);
  });

  it('should search by multiple terms in name', async () => {
    searchIndex.indexResults([
      { id: 'id', name: 'Homer Simpson', mentionName: 'mentionName' },
    ]);

    const result = await searchIndex.search('h s');
    expect(result.mentions).toHaveLength(1);
  });

  it('should not search special mention on name', async () => {
    searchIndex.indexResults([
      {
        id: 'all',
        name: 'All room members',
        mentionName: 'all',
        nickname: 'all',
        userType: 'SPECIAL',
      },
    ]);

    const result = await searchIndex.search('m');
    expect(result.mentions).toHaveLength(0);
  });

  it('should search special mention on nickname', async () => {
    searchIndex.indexResults([
      {
        id: 'all',
        name: 'All room members',
        mentionName: 'all',
        nickname: 'all',
        userType: 'SPECIAL',
      },
    ]);

    const result = await searchIndex.search('a');
    expect(result.mentions).toHaveLength(1);
  });

  describe('#hasDocuments', () => {
    it('should be true if index contains mention', async () => {
      expect(searchIndex.hasDocuments()).toBe(false);

      searchIndex.indexResults([
        {
          id: 'id',
          name: 'Homer Simpson',
          mentionName: 'mentionName',
          inContext: true,
        },
      ]);

      expect(searchIndex.hasDocuments()).toBe(true);
    });

    it('should be false after reset()', async () => {
      searchIndex.indexResults([
        {
          id: 'id',
          name: 'Homer Simpson',
          mentionName: 'mentionName',
          inContext: true,
        },
      ]);

      expect(searchIndex.hasDocuments()).toBe(true);

      searchIndex.reset();

      expect(searchIndex.hasDocuments()).toBe(false);
    });
  });
});

describe('compareMentionDescription', () => {
  it('should put in context mention first', () => {
    const result = mentionDescriptionComparator(new Set())(
      { id: 'id1', inContext: true },
      { id: 'id2', inContext: false },
    );

    expect(result).toBeLessThan(0);
  });

  it('should use weight as a second sort criteria', () => {
    const result = mentionDescriptionComparator(new Set())(
      { id: 'id1', inContext: true, weight: 0 },
      { id: 'id2', inContext: true, weight: 1 },
    );

    expect(result).toBeLessThan(0);
  });

  it('should put mention without weight second', () => {
    const result = mentionDescriptionComparator(new Set())(
      { id: 'id1', inContext: true, weight: 5 },
      { id: 'id2', inContext: true },
    );

    expect(result).toBeLessThan(0);
  });

  it('should put special mention first', () => {
    const result = mentionDescriptionComparator(new Set())(
      { id: 'id1', userType: 'SPECIAL' },
      { id: 'id2' },
    );

    expect(result).toBeLessThan(0);
  });
});

describe('Highlighter', () => {
  const rules = [
    {
      description: 'no match',
      value: 'Very, very frightening me',
      query: 'nothing',
      results: [],
    },
    {
      description: 'empty query',
      value: 'Very, very frightening me',
      query: '',
      results: [],
    },
    { description: 'empty field', value: '', query: 'nothing', results: [] },
    {
      description: 'one match',
      value: 'Easy come, easy go, will you let me go?',
      query: 'com',
      results: [{ start: 5, end: 7 }],
    },
    {
      description: 'multiple matches',
      value: 'scaramouche, scaramouche, will you do the fandango',
      query: 'scaramouche',
      results: [{ start: 0, end: 10 }, { start: 13, end: 23 }],
    },
    {
      description: 'consecutive matches',
      value: 'ab ab ab',
      query: 'ab',
      results: [
        { start: 0, end: 1 },
        { start: 3, end: 4 },
        { start: 6, end: 7 },
      ],
    },
    {
      description: 'lowercase',
      value: 'Galileo Figaro',
      query: 'figaro',
      results: [{ start: 8, end: 13 }],
    },
    {
      description: 'unicode',
      value: '我是法国人',
      query: '我',
      results: [{ start: 0, end: 0 }],
    },
    {
      description: 'diacritics',
      value: 'orč pžs íáýd',
      query: 'orč',
      results: [{ start: 0, end: 2 }],
    },
    {
      description: 'multiple terms',
      value: 'scaramouche, scaramouche, will you do the fandango',
      query: 'wi fan',
      results: [{ start: 26, end: 27 }, { start: 42, end: 44 }],
    },
    {
      description: 'multiple identical terms',
      value: 'tim tam',
      query: 't t',
      results: [{ start: 0, end: 0 }, { start: 4, end: 4 }],
    },
    {
      description: 'multiple identical terms with subterms',
      value: 'tim tam',
      query: 'ti t',
      results: [{ start: 0, end: 1 }, { start: 4, end: 4 }],
    },
    {
      description: 'apostrophe',
      value: "Homer D'Simpson",
      query: "D'S",
      results: [{ start: 6, end: 8 }],
    },
    {
      description: 'no highlight if not every term matches',
      value: 'scaramouche, scaramouche, will you',
      query: 'wi fan',
      results: [],
    },
    {
      description: 'multiple identical terms with subterms 2',
      value: 'tim tam',
      query: 't ti',
      results: [{ start: 0, end: 1 }, { start: 4, end: 4 }],
    },
    {
      description: 'combining character',
      value: 'ញុំ',
      query: 'ញ',
      results: [{ start: 0, end: 2 }],
    },
  ];

  it('should match rules', () => {
    for (let key in rules) {
      if (rules.hasOwnProperty(key)) {
        const rule = rules[key];
        const highlights = Highlighter.find(rule.value, rule.query);
        expect(highlights).toHaveLength(rule.results.length);

        for (let index = 0; index < rule.results.length; index++) {
          expect(highlights).toContainEqual(rule.results[index]);
        }
      }
    }
  });
});
