// @flow

import React from 'react';
import { mount } from 'enzyme';
import SearchIcon from '@atlaskit/icon/glyph/search';
import CreateIcon from '@atlaskit/icon/glyph/add';
import StarLargeIcon from '@atlaskit/icon/glyph/star-large';
import NotificationIcon from '@atlaskit/icon/glyph/notification';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import SignInIcon from '@atlaskit/icon/glyph/sign-in';
import QuestionIcon from '@atlaskit/icon/glyph/question-circle';
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

    // $FlowFixMe Silence warnings from global-navigation for imporoper props
    console.warn = jest.fn();
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

  describe('Drawers', () => {
    const drawerItems = [
      {
        akIcon: SearchIcon,
        capitalisedName: 'Search',
        name: 'search',
      },
      {
        akIcon: CreateIcon,
        capitalisedName: 'Create',
        name: 'create',
      },
      {
        akIcon: StarLargeIcon,
        capitalisedName: 'Starred',
        name: 'starred',
      },
      {
        akIcon: NotificationIcon,
        capitalisedName: 'Notification',
        name: 'notification',
      },
    ];

    drawerItems.forEach(({ name, akIcon, capitalisedName }) => {
      it(`should not add ${name} icon if on${capitalisedName}Click and ${name}DrawerContents are absent`, () => {
        // Testing onXClick and XDrawerContents props (negative)
        const props = {
          [`${name}Tooltip`]: 'test tooltip',
        };
        const wrapper = mount(<GlobalNavigation {...props} />);
        const icon = wrapper.find(akIcon);
        expect(icon).toHaveLength(0);
      });

      it(`should allow on${capitalisedName}Click to be passed and ${name}Drawer should not be present`, () => {
        // Testing onXClick positive
        const props = {
          [`on${capitalisedName}Click`]: jest.fn(),
        };
        const wrapper = mount(<GlobalNavigation {...props} />);
        expect(wrapper.find(DrawerContents)).toHaveLength(0);

        const icon = wrapper.find(akIcon);
        expect(icon).toHaveLength(1);
        icon.simulate('click');

        expect(props[`on${capitalisedName}Click`]).toHaveBeenCalled();
        expect(wrapper.find(DrawerContents)).toHaveLength(0);
      });

      it(`should open ${name} drawer when ${name}Icon is clicked`, () => {
        // Testing XDrawerContents positive
        const props = {
          [`${name}DrawerContents`]: DrawerContents,
        };
        const wrapper = mount(<GlobalNavigation {...props} />);
        expect(wrapper.find(DrawerContents)).toHaveLength(0);

        const icon = wrapper.find(akIcon);
        icon.simulate('click');

        expect(wrapper.find(DrawerContents)).toHaveLength(1);
      });

      it(`should allow ${name} drawer to be controlled`, () => {
        // Test onXClick, onXDrawerClose, isXDrawerOpen
        const props = {
          [`${name}DrawerContents`]: DrawerContents,
          [`is${capitalisedName}DrawerOpen`]: false,
          [`on${capitalisedName}Click`]: jest.fn(),
        };
        const wrapper = mount(<GlobalNavigation {...props} />);
        expect(wrapper.find(DrawerContents)).toHaveLength(0);

        const icon = wrapper.find(akIcon);
        icon.simulate('click');
        expect(props[`on${capitalisedName}Click`]).toHaveBeenCalled();

        wrapper.setProps({
          [`is${capitalisedName}DrawerOpen`]: true,
        });
        wrapper.update();
        expect(wrapper.find(DrawerContents)).toHaveLength(1);
        escKeyDown();
        wrapper.render();
      });

      it(`should fire drawer onClose callback for controlled ${name} drawer`, () => {
        // Test  onXDrawerClose
        const props = {
          [`is${capitalisedName}DrawerOpen`]: true,
          [`${name}DrawerContents`]: DrawerContents,
          [`on${capitalisedName}DrawerClose`]: jest.fn(),
        };
        const wrapper = mount(<GlobalNavigation {...props} />);

        wrapper.setProps({
          isSearchDrawerOpen: false,
        });
        wrapper.update();
        escKeyDown();
        expect(props[`on${capitalisedName}DrawerClose`]).toHaveBeenCalled();
      });

      it(`should fire drawer callbacks for uncontrolled ${name} drawer`, () => {
        // Test  onXDrawerClose, onXDrawerOpen
        const props = {
          [`${name}DrawerContents`]: DrawerContents,
          [`on${capitalisedName}DrawerClose`]: jest.fn(),
          [`on${capitalisedName}DrawerOpen`]: jest.fn(),
        };
        const wrapper = mount(<GlobalNavigation {...props} />);

        const icon = wrapper.find(akIcon);
        icon.simulate('click');
        expect(props[`on${capitalisedName}DrawerOpen`]).toHaveBeenCalled();
        escKeyDown();
        expect(props[`on${capitalisedName}DrawerClose`]).toHaveBeenCalled();
      });

      it(`should honour the shouldUnmountOnExit prop for ${name} drawer`, () => {
        // test shouldXUnmountOnExit
        const props = {
          [`${name}DrawerContents`]: DrawerContents,
          [`on${capitalisedName}DrawerClose`]: jest.fn(),
          [`on${capitalisedName}DrawerOpen`]: jest.fn(),
        };
        const wrapper = mount(<GlobalNavigation {...props} />);

        const icon = wrapper.find(akIcon);
        icon.simulate('click');
        expect(
          wrapper.find('DrawerBase').props().shouldUnmountOnExit,
        ).toBeFalsy();

        wrapper.setProps({
          [`should${capitalisedName}DrawerUnmountOnExit`]: true,
        });
        wrapper.update();

        expect(
          wrapper.find('DrawerBase').props().shouldUnmountOnExit,
        ).toBeTruthy();
      });
    });
  });

  describe('Tooltips and default config', () => {
    const AppSwitcher = () => <div />;
    AppSwitcher.displayName = 'AppSwitcher';

    const wrapper = mount(
      <GlobalNavigation
        productIcon={EmojiAtlassianIcon}
        productHref="#"
        productTooltip="product tooltip"
        onProductClick={() => console.log('product clicked')}
        createTooltip="create tooltip"
        onCreateClick={() => console.log('create clicked')}
        searchTooltip="search tooltip"
        onSearchClick={() => console.log('search clicked')}
        starredTooltip="starred tooltip"
        onStarredClick={() => console.log('your work clicked')}
        notificationTooltip="notification tooltip"
        onNotificationClick={() => console.log('notification clicked')}
        appSwitcherComponent={AppSwitcher}
        appSwitcherTooltip="appSwitcher tooltip"
        profileTooltip="profile tooltip"
        loginHref="#login"
        helpItems={() => <div>items</div>}
        helpTooltip="help tooltip"
      />,
    );

    const navItems = [
      {
        icon: EmojiAtlassianIcon,
        name: 'product',
        section: 'primary',
        rank: 1,
      },
      {
        icon: SearchIcon,
        name: 'search',
        section: 'primary',
        rank: 3,
      },
      {
        icon: CreateIcon,
        name: 'create',
        section: 'primary',
        rank: 4,
      },
      {
        icon: StarLargeIcon,
        name: 'starred',
        section: 'primary',
        rank: 2,
      },
      {
        icon: NotificationIcon,
        name: 'notification',
        section: 'secondary',
        rank: 1,
      },
      {
        icon: AppSwitcher,
        name: 'appSwitcher',
        section: 'secondary',
        rank: 2,
      },
      {
        icon: SignInIcon,
        name: 'profile',
        section: 'secondary',
        rank: 5,
      },
      {
        icon: QuestionIcon,
        name: 'help',
        section: 'secondary',
        rank: 4,
      },
    ];

    navItems.forEach(({ icon, name }) => {
      it(`should render a tooltip for ${name} item`, () => {
        if (name === 'appSwitcher') {
          expect(wrapper.find(AppSwitcher).props().label).toBe(
            'appSwitcher tooltip',
          );
          expect(wrapper.find(AppSwitcher).props().tooltip).toBe(
            'appSwitcher tooltip',
          );
          return;
        }
        expect(
          wrapper
            .find(icon)
            .parents('Tooltip')
            .props().content,
        ).toBe(`${name} tooltip`);
        expect(wrapper.find(icon).props().label).toBe(`${name} tooltip`);
      });
    });

    navItems.forEach(({ icon, section, rank, name }) => {
      it(`should pick up section for ${name} from defaultConfig`, () => {
        if (section === 'secondary') {
          expect(
            wrapper
              .find(icon)
              .parents()
              .exists('SecondaryItemsList'),
          ).toBeTruthy();
          return;
        }

        if (section === 'primary') {
          expect(
            wrapper
              .find(icon)
              .parents()
              .exists('PrimaryItemsList'),
          ).toBeTruthy();
        }
      });

      it(`should pick up rank for ${name} from defaultConfig`, () => {
        if (section === 'primary') {
          expect(
            wrapper
              .find('PrimaryItemsList')
              .find('GlobalItemBase')
              .at(rank)
              .children()
              .exists(icon),
          ).toBeTruthy();
          return;
        }
        if (section === 'secondary') {
          expect(
            wrapper
              .find('SecondaryItemsList')
              .find('GlobalItemBase')
              .at(rank)
              .children()
              .exists(icon),
          ).toBeTruthy();
        }
      });
    });
  });

  describe('Notification', () => {});
  describe('AppSwitcher', () => {});
  describe('Help', () => {});
  describe('Profile', () => {});

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
