// @flow
import { mount } from 'enzyme';
import React from 'react';
import ThemedCode, { Code } from '../../Code';

const input = `
  const a = 'foo';
  const b = 'bar';
  const c = [a, b].map(item => item + item);
`;

describe('Code', () => {
  it('should have an empty string as the default language', () => {
    expect(
      mount(<ThemedCode text={input} />)
        .find(Code)
        .prop('language'),
    ).toBe('');
  });
});
