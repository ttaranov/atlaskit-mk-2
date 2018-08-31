import { find } from '../../../../plugins/quick-insert/search';

describe('Quick Insert Search', () => {
  const getTitles = item => item.title;
  const items = [
    { priority: 1, title: 'Table' },
    { priority: 9, title: 'Panel' },
    { priority: 8, title: 'Code block' },
    { priority: 7, title: 'Date' },
    { priority: 6, title: 'Block quote' },
    { priority: 2, title: 'Files and Images' },
    { priority: 3, title: 'Horizontal rule' },
    { priority: 4, title: 'Action' },
    { priority: 5, title: 'Decision' },
  ];

  it('should find exact match', () => {
    expect(find('Date', items)[0].title).toBe('Date');
  });

  it('should find an item approximately matching a query', () => {
    expect(find('dte', items)[0].title).toBe('Date');
  });

  it('should find items that approximately match a query', () => {
    expect(find('te', items).map(getTitles)).toEqual([
      'Table',
      'Date',
      'Block quote',
      'Horizontal rule',
    ]);
  });

  it('should respect item priority', () => {
    expect(find('', items).map(getTitles)).toEqual([
      'Table',
      'Files and Images',
      'Horizontal rule',
      'Action',
      'Decision',
      'Block quote',
      'Date',
      'Code block',
      'Panel',
    ]);
  });

  it('should respect item priority when 2 items match a query with the same score', () => {
    expect(
      find('code', [...items, { priority: 9, title: 'Code inline' }]).map(
        getTitles,
      ),
    ).toEqual(['Code block', 'Code inline']);
  });

  it('should take into account order of characters', () => {
    expect(find('ble', items).map(getTitles)).toEqual(['Table', 'Block quote']);
  });

  it('should not match string when character repeats more times than in original string', () => {
    expect(find('//', [{ title: '/' }])).toEqual([]);
  });
});
