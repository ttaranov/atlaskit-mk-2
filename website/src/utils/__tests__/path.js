import { basename, join, removeNumericPrefix, removeSuffix } from '../path';

describe('basename', () => {
  it('one part', () => {
    expect(basename('one.js')).toBe('one.js');
  });

  it('multiple parts', () => {
    expect(basename('one/two/three.js')).toBe('three.js');
  });

  it('empty parts', () => {
    expect(basename('/two//four.js')).toBe('four.js');
  });
});

describe('join', () => {
  it('single argument', () => {
    expect(join('one')).toBe('one');
  });

  it('multiple arguments', () => {
    expect(join('one', 'two', 'three')).toBe('one/two/three');
  });

  it('empty arguments', () => {
    expect(join('', 'two', '', 'four', '')).toBe('two/four');
  });
});

describe('removeNumericPrefix', () => {
  it('single prefix', () => {
    expect(removeNumericPrefix('1-test.js')).toBe('test.js');
  });

  it('multiple prefixes', () => {
    expect(removeNumericPrefix('1-2-test.js')).toBe('2-test.js');
  });

  it('with a pathname', () => {
    expect(removeNumericPrefix('1-2-pathname/1-2-test.js')).toBe('2-pathname/1-2-test.js');
  });
});

describe('removeSuffix', () => {
  it('no suffix', () => {
    expect(removeSuffix('test')).toBe('test');
  });

  it('single suffix', () => {
    expect(removeSuffix('test.js')).toBe('test');
  });

  it('multiple suffixes', () => {
    expect(removeSuffix('test.js.asdf')).toBe('test.js');
  });
});
