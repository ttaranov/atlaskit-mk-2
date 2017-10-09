// @flow
import { basename, join, removeNumericPrefix, removeSuffix } from '../path';

describe('basename', () => {
  it('no parts', () => {
    expect(basename('')).toBe('');
  });

  it('one part', () => {
    expect(basename('one.js')).toBe('one.js');
  });

  it('multiple parts', () => {
    expect(basename('one/two/three.js')).toBe('three.js');
  });

  it('empty parts in between', () => {
    expect(basename('/two//four.js')).toBe('four.js');
  });
});

describe('join', () => {
  it('no arguments', () => {
    expect(join()).toBe('');
  });

  it('empty argument', () => {
    expect(join('')).toBe('');
  });

  it('single argument', () => {
    expect(join('one')).toBe('one');
  });

  it('multiple arguments', () => {
    expect(join('one', 'two', 'three')).toBe('one/two/three');
  });

  it('empty arguments in between', () => {
    expect(join('', 'two', '', 'four', '')).toBe('two/four');
  });
});

describe('removeNumericPrefix', () => {
  it('no prefix', () => {
    expect(removeNumericPrefix()).toBe('');
  });

  it('empty prefix', () => {
    expect(removeNumericPrefix('')).toBe('');
  });

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
  it('no arguments', () => {
    expect(removeSuffix()).toBe('');
  });

  it('empty argument', () => {
    expect(removeSuffix('')).toBe('');
  });

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
