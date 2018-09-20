// @flow

import React from 'react';
import { mount } from 'enzyme';
import SearchIcon from '@atlaskit/icon/glyph/search';
import GlobalNavigation from '../../index';

import { fireDrawerDismissedEvents } from '../../analytics';

jest.mock('../../analytics', () => ({
  fireDrawerDismissedEvents: jest.fn(),
  analyticsIdMap: {},
}));

const DrawerContents = () => <div />;

const escKeyDown = () => {
  const event = document.createEvent('Events');
  event.initEvent('keydown', true, true);
  // $FlowFixMe
  event.key = 'Escape';
  global.window.dispatchEvent(event);
};

describe('GlobalNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should open search drawer when searchIcon is clicked', () => {
    const wrapper = mount(
      <GlobalNavigation searchDrawerContents={DrawerContents} />,
    );
    expect(wrapper.find(DrawerContents)).toHaveLength(0);

    const searchIcon = wrapper.find(SearchIcon);
    expect(searchIcon).toHaveLength(1);
    searchIcon.simulate('click');

    expect(wrapper.find(DrawerContents)).toHaveLength(1);
  });

  it('fireDrawerDismissedEvents should be called when drawer is closed', () => {
    const wrapper = mount(
      <GlobalNavigation searchDrawerContents={DrawerContents} />,
    );

    const searchIcon = wrapper.find(SearchIcon);
    searchIcon.simulate('click');

    expect(fireDrawerDismissedEvents).not.toHaveBeenCalled();

    escKeyDown();

    expect(fireDrawerDismissedEvents).toHaveBeenCalledWith(
      'search',
      expect.objectContaining({
        payload: expect.objectContaining({
          action: 'dismissed',
          actionSubject: 'drawer',
          attributes: expect.objectContaining({
            trigger: 'escKey',
          }),
        }),
      }),
    );
  });
});
