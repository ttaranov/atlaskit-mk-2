import { mount } from 'enzyme';
import * as React from 'react';
import FieldBase from '@atlaskit/field-base';
import Search from '../../Search';

describe('Search', () => {
  const isInputFocused = wrapper =>
    wrapper.find('input').getDOMNode() === document.activeElement;

  it('should auto focus on mount', () => {
    const wrapper = mount(<Search onInput={() => {}} onKeyDown={() => {}} />);

    expect(isInputFocused(wrapper)).toBe(true);
  });

  it('should pass on its isLoading prop to the internal FieldBase for it to handle', () => {
    expect(
      mount(<Search onInput={() => {}} onKeyDown={() => {}} isLoading />)
        .find(FieldBase)
        .at(0)
        .prop('isLoading'),
    ).toBe(true);
    expect(
      mount(
        <Search onInput={() => {}} onKeyDown={() => {}} isLoading={false} />,
      )
        .find(FieldBase)
        .at(0)
        .prop('isLoading'),
    ).toBe(false);
  });
});
