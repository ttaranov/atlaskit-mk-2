// @flow

import React from 'react';
import { mount } from 'enzyme';
import SearchIcon from '@atlaskit/icon/glyph/search';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import GlobalNavigation from '../../index';
import ScreenTracker from '../../../ScreenTracker';

const DrawerContents = () => <div>drawer</div>;

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

  describe('Product logo', () => {
    it('should not render product logo when href and onClick are absent', () => {
      const wrapper = mount(
        <GlobalNavigation productIcon={EmojiAtlassianIcon} />,
      );
      const productIcon = wrapper.find(EmojiAtlassianIcon);
      expect(productIcon).toHaveLength(0);
    });

    it('should href for product logo', () => {
      const wrapper = mount(
        <GlobalNavigation
          productIcon={EmojiAtlassianIcon}
          productHref="/testtest"
        />,
      );

      const productIcon = wrapper.find(EmojiAtlassianIcon);
      expect(productIcon).toHaveLength(1);
      expect(wrapper.props().productHref).toEqual('/testtest');
    });

    it('should pass both href and onClick for product logo', () => {
      const mockProductClick = jest.fn();
      const wrapper = mount(
        <GlobalNavigation
          productIcon={EmojiAtlassianIcon}
          productHref="/testtest"
          onProductClick={mockProductClick}
        />,
      );

      const productIcon = wrapper.find(EmojiAtlassianIcon);
      expect(productIcon).toHaveLength(1);
      expect(wrapper.props().productHref).toEqual('/testtest');
      productIcon.simulate('click');
      expect(mockProductClick).toHaveBeenCalled();
    });
  });

  describe('Search', () => {
    it('should not add search icon if onSearchClick and searchDrawerContents are absent', () => {
      const wrapper = mount(
        <GlobalNavigation searchTooltip="search tooltip" />,
      );
      const searchIcon = wrapper.find(SearchIcon);
      expect(searchIcon).toHaveLength(0);
    });

    it('should allow onSearchClick to be passed and no drawer should show up', () => {
      const mockSearchClick = jest.fn();
      const wrapper = mount(
        <GlobalNavigation onSearchClick={mockSearchClick} />,
      );
      expect(wrapper.find(DrawerContents)).toHaveLength(0);

      const searchIcon = wrapper.find(SearchIcon);
      expect(searchIcon).toHaveLength(1);
      searchIcon.simulate('click');

      expect(mockSearchClick).toHaveBeenCalled();
      expect(wrapper.find(DrawerContents)).toHaveLength(0);
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

    it('should allow search drawer to be controlled', () => {
      const mockDrawerCloseCb = jest.fn();
      const wrapper = mount(
        <GlobalNavigation
          searchDrawerContents={DrawerContents}
          isSearchDrawerOpen={false}
          onSearchClick={() => undefined}
          onSearchDrawerClose={mockDrawerCloseCb}
        />,
      );
      expect(wrapper.find(DrawerContents)).toHaveLength(0);

      wrapper.setProps({
        isSearchDrawerOpen: true,
      });
      escKeyDown();
      wrapper.update();
      expect(wrapper.find(DrawerContents)).toHaveLength(1);
    });

    it.only('should fire drawer callbacks for controlled drawers', () => {
      const mockDrawerCloseCb = jest.fn();
      const wrapper = mount(
        <GlobalNavigation
          onSearchClick={() => undefined}
          isSearchDrawerOpen
          searchDrawerContents={DrawerContents}
          onSearchDrawerClose={mockDrawerCloseCb}
        />,
      );

      wrapper.setProps({
        isSearchDrawerOpen: false,
      });
      console.log(wrapper.props());
      escKeyDown();
      wrapper.update();
      expect(mockDrawerCloseCb).toHaveBeenCalled();
    });

    it('should fire drawer callbacks for uncontrolled drawers', () => {
      const mockDrawerOpenCb = jest.fn();
      const mockDrawerCloseCb = jest.fn();
      const wrapper = mount(
        <GlobalNavigation
          searchDrawerContents={DrawerContents}
          onSearchDrawerClose={mockDrawerCloseCb}
          onSearchDrawerOpen={mockDrawerOpenCb}
        />,
      );

      const searchIcon = wrapper.find(SearchIcon);
      expect(searchIcon).toHaveLength(1);
      searchIcon.simulate('click');
      expect(mockDrawerOpenCb).toHaveBeenCalled();
      escKeyDown();
      expect(mockDrawerCloseCb).toHaveBeenCalled();
    });

    it('should honour the shouldUnmountOnExit prop');
  });

  describe('Tooltips', () => {
    it('should render product tooltip');
    it('should render search tooltip');
    it('should render create tooltip');
    it('should render notification tooltip');
    it('should render appSwitcher tooltip');
    it('should render profile tooltip');
    it('should render help tooltip');
  });

  it('should have a test for every prop');

  describe('Analytics', () => {
    it('should call fireDrawerDismissedEvents when drawer is closed', () => {
      const mockFireDrawerDismissedEvents = jest.fn();
      jest.doMock('../../analytics', () => ({
        fireDrawerDismissedEvents: mockFireDrawerDismissedEvents,
        analyticsIdMap: {},
      }));

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
});
