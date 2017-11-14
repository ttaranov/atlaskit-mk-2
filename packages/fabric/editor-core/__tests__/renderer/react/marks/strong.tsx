import * as React from 'react';
import { shallow } from 'enzyme';
import Strong from '../../../../src/renderer/react/marks/strong';

describe('Renderer - React/Marks/Strong', () => {
  const mark = shallow(<Strong>This is strong</Strong>);

  it('should wrap content with <strong>-tag', () => {
    expect(mark.is('strong')).toBe(true);
  });

  it('should output correct html', () => {
    expect(mark.html()).toEqual('<strong>This is strong</strong>');
  });
});
