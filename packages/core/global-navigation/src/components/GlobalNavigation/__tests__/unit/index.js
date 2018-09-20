// @flow

import React from 'react';
import { mount } from 'enzyme';
import SearchIcon from '@atlaskit/icon/glyph/search';
import GlobalNavigation from '../../index';
import ScreenTracker from '../../../ScreenTracker';

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
    jest.resetModules();
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

  it('should call fireDrawerDismissedEvents when drawer is closed', () => {
    const mockFireDrawerDismissedEvents = jest.fn();
    jest.doMock('../../analytics', () => ({
      fireDrawerDismissedEvents: mockFireDrawerDismissedEvents,
      analyticsIdMap: {},
    }));

    // eslint-disable-next-line global-require
    const GlobalNavigationWithMock = require('../../index').default;
    const wrapper = mount(
      <GlobalNavigationWithMock searchDrawerContents={DrawerContents} />,
    );

    const searchIcon = wrapper.find('SearchIcon');
    searchIcon.simulate('click');

    expect(mockFireDrawerDismissedEvents).not.toHaveBeenCalled();

    escKeyDown();

    expect(mockFireDrawerDismissedEvents).toHaveBeenCalledWith(
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

  [
    {
      drawerName: 'search',
      analyticsId: 'quickSearchDrawer',
    },
    {
      drawerName: 'create',
      analyticsId: 'createDrawer',
    },
    {
      drawerName: 'notification',
      analyticsId: 'notificationsDrawer',
    },
    {
      drawerName: 'starred',
      analyticsId: 'starDrawer',
    },
  ].forEach(({ drawerName, analyticsId }) => {
    it(`should render ScreenTracker with correct props for ${drawerName} drawer when drawer is open`, () => {
      const capitalisedDrawerName = `${drawerName[0].toUpperCase()}${drawerName.slice(
        1,
      )}`;
      const isOpenPropName = `is${capitalisedDrawerName}DrawerOpen`;
      const props = {
        [`${drawerName}DrawerContents`]: DrawerContents,
        [`on${capitalisedDrawerName}Click`]: () => {},
        [isOpenPropName]: false,
      };

      const wrapper = mount(<GlobalNavigation {...props} />);
      expect(wrapper.find(ScreenTracker)).toHaveLength(0);
      wrapper.setProps({
        [isOpenPropName]: true,
      });
      wrapper.update();

      const screenTracker = wrapper.find(ScreenTracker);
      expect(screenTracker).toHaveLength(1);
      expect(screenTracker.props()).toEqual({
        name: analyticsId,
        isVisible: true,
      });

      wrapper.setProps({
        [isOpenPropName]: false,
      });
      wrapper.update();
      expect(wrapper.find(ScreenTracker).props()).toEqual({
        name: analyticsId,
        isVisible: false,
      });
    });
  });
});
