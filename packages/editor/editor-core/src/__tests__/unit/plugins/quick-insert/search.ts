import { find } from '../../../../plugins/quick-insert/search';

describe('Quick Insert Search', () => {
  const items = [
    'Table',
    'Panel',
    'Code block',
    'Date',
    'Block quote',
    'Files and Images',
    'Horizontal rule',
    'Action',
    'Decision',
  ];

  it('should find exact match', () => {
    expect(find('Date', items)[0]).toBe('Date');
  });

  it('should find an item approximately matching a query', () => {
    expect(find('dte', items)[0]).toBe('Date');
  });

  it('should find items that approximately match a query', () => {
    expect(find('te', items)).toEqual([
      'Table',
      'Date',
      'Block quote',
      'Horizontal rule',
    ]);
  });

  it('should take into account order of characters', () => {
    expect(find('ble', items)).toEqual(['Table', 'Block quote']);
  });

  it('should not match string when character repeats more times than in original string', () => {
    expect(find('//', ['/'])).toEqual([]);
  });
});
