// @flow

import React from 'react';
import GlobalNavigation from '@atlaskit/global-navigation';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { AtlassianIcon, AtlassianWordmark } from '@atlaskit/logo';
import {
  ContainerHeader,
  GroupHeading,
  Item,
  ItemAvatar,
  LayoutManager,
  NavigationProvider,
  Section,
  Separator,
  UIControllerSubscriber,
} from '../src';

const MyGlobalNavigation = () => (
  <GlobalNavigation
    productIcon={() => <AtlassianIcon size="medium" />}
    onProductClick={() => {}}
  />
);

const MyProductNavigation = () => (
  <div css={{ padding: '16px 0' }}>
    <Section>
      {({ className }) => (
        <div className={className}>
          <div css={{ padding: '8px 0' }}>
            <AtlassianWordmark />
          </div>
        </div>
      )}
    </Section>
    <Section>
      {({ className }) => (
        <div className={className}>
          <Item text="Dashboard" />
          <Item text="Things" />
          <Item text="Settings" />
          <Separator />
          <GroupHeading>Add-ons</GroupHeading>
          <Item text="My plugin" />
        </div>
      )}
    </Section>
  </div>
);

const MyContainerNavigation = () => (
  <div css={{ padding: '16px 0' }}>
    <Section>
      {({ className }) => (
        <div className={className}>
          <ContainerHeader
            before={itemState => (
              <ItemAvatar itemState={itemState} appearance="square" />
            )}
            text="Container name"
            subText="Container description"
          />
        </div>
      )}
    </Section>
    <Section>
      {({ className }) => (
        <div className={className}>
          <Item text="Things in this container" />
          <Item text="Reports" />
          <Item text="Some other thing" />
          <Separator />
          <GroupHeading>Shortcuts</GroupHeading>
          <Item before={ShortcutIcon} text="Team space" />
        </div>
      )}
    </Section>
  </div>
);

const ExpandToggleButton = () => (
  <UIControllerSubscriber>
    {navigationUIController => (
      <button onClick={navigationUIController.toggleCollapse}>
        {navigationUIController.state.isCollapsed ? 'Expand' : 'Collapse'}{' '}
        product navigation
      </button>
    )}
  </UIControllerSubscriber>
);

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={MyGlobalNavigation}
      productNavigation={MyProductNavigation}
      containerNavigation={MyContainerNavigation}
    >
      <div>
        <ExpandToggleButton />
      </div>
    </LayoutManager>
  </NavigationProvider>
);
