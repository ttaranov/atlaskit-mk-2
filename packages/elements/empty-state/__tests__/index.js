// @flow

import React from 'react';
import { mount } from 'enzyme';

import Spinner from '@atlaskit/spinner';

import EmptyState from '../src/EmptyState';

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
    const spy = jest.fn();
    const wrapper = mount(
      <EmptyState
        header="Test header"
        secondaryAction={{ label: 'Test action', onClick: spy }}
      />,
    );

    expect(wrapper.find('button').length).toBe(1);
  });

  it('should invoke an event handler when secondary action button is clicked', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <EmptyState
        header="Test header"
        secondaryAction={{
          label: 'Test action',
          onClick: spy,
        }}
      />,
    );

    wrapper.find('button').simulate('click');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render link action when linkAction prop is not empty', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <EmptyState
        header="Test header"
        linkAction={{ label: 'Link action', url: 'test url', onClick: spy }}
      />,
    );

    expect(wrapper.find('a').length).toBe(1);
  });

  it('should invoke an event handler when link action button is clicked', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <EmptyState
        header="Test header"
        linkAction={{
          label: 'Test action',
          url: 'test url',
          onClick: spy,
        }}
      />,
    );

    wrapper.find('a').simulate('click');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not render any action when action props are empty', () => {
    const wrapper = mount(<EmptyState header="Test header" />);

    expect(wrapper.find('button').length).toBe(0);
  });

  it('should render spinner when isLoading prop is true', () => {
    const wrapper = mount(<EmptyState header="Test header" isLoading />);

    expect(wrapper.find(Spinner).length).toBe(1);
  });
});
