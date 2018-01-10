import React from 'react';
import FieldBase from '@atlaskit/field-base';
import { mountWithRootTheme } from './_theme-util';
import Search from '../../src/components/js/Search';

const describe = window.describe;
const it = window.it;
const expect = window.expect;

describe('Search', () => {
  const isInputFocused = wrapper =>
    wrapper.find('input').getDOMNode() === document.activeElement;

  it('should auto focus on mount', () => {
    const wrapper = mountWithRootTheme(
      <Search onInput={() => {}} onKeyDown={() => {}} />,
    );

    expect(isInputFocused(wrapper)).toBe(true);
  });

  it('should pass on its isLoading prop to the internal FieldBase for it to handle', () => {
    expect(
      mountWithRootTheme(
        <Search onInput={() => {}} onKeyDown={() => {}} isLoading />,
      )
        .find(FieldBase)
        .at(0)
        .prop('isLoading'),
    ).toBe(true);
    expect(
      mountWithRootTheme(
        <Search onInput={() => {}} onKeyDown={() => {}} isLoading={false} />,
      )
        .find(FieldBase)
        .at(0)
        .prop('isLoading'),
    ).toBe(false);
  });
});
