// @flow

import React from 'react';
import { mount } from 'enzyme';

import Spinner from '@atlaskit/spinner';

import EmptyState from '../src/EmptyState';

// TODO
// should invoke an event handler when primary action button is clicked
// should invoke an event handler when secondary action button is clicked

describe('Empty state', () => {
  it('should render primary action when primaryAction prop is not empty', () => {
    const wrapper = mount(
      <EmptyState
        header="Test header"
        primaryAction={{ label: 'Test action', onClick: () => {} }}
      />,
    );

    expect(wrapper.find('button').length).toBe(1);
  });

  it('should not render primary action when primaryAction prop is empty', () => {
    const wrapper = mount(<EmptyState header="Test header" />);

    expect(wrapper.find('button').length).toBe(0);
  });

  it('should invoke an event handler when primary action button is clicked', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <EmptyState
        header="Test header"
        primaryAction={{ label: 'Test action', onClick: spy }}
      />,
    );

    wrapper.find('button').simulate('click');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render secondary action when secondaryAction prop is not empty', () => {
    const wrapper = mount(
      <EmptyState
        header="Test header"
        secondaryAction={{ label: 'Test action', url: 'Test url' }}
      />,
    );

    expect(wrapper.find('a').length).toBe(1);
  });

  it('should not render secondary action when secondaryAction prop is empty', () => {
    const wrapper = mount(<EmptyState header="Test header" />);

    expect(wrapper.find('a').length).toBe(0);
  });

  it('should invoke an event handler when secondary action link is clicked', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <EmptyState
        header="Test header"
        secondaryAction={{
          label: 'Test action',
          url: 'Test url',
          onClick: spy,
        }}
      />,
    );

    wrapper.find('a').simulate('click');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render spinner when primaryAction.isLoading prop is true', () => {
    const wrapper = mount(
      <EmptyState
        header="Test header"
        primaryAction={{
          label: 'Test action',
          onClick: () => {},
          isLoading: true,
        }}
      />,
    );

    expect(wrapper.find(Spinner).length).toBe(1);
  });
});
