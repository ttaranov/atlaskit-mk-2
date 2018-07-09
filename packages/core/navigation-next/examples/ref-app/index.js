// @flow

import React from 'react';
import GlobalNavigation from '@atlaskit/global-navigation';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { AtlassianWordmark } from '@atlaskit/logo';
import {
  ContainerHeader,
  Item,
  ItemAvatar,
  LayoutManager,
  NavigationProvider,
  NavigationSubscriber,
  Section,
  SectionSeparator,
  SectionTitle,
} from '../../src';

const MyGlobalNavigation = () => (
  <NavigationSubscriber>
    {({ togglePeek }) => (
      <GlobalNavigation
        productIcon={AtlassianIcon}
        onProductClick={togglePeek}
      />
    )}
  </NavigationSubscriber>
);

const ProductNavigationWrapper = props => (
  <div style={{ padding: 16 }} {...props} />
);

const MyProductNavigation = () => (
  <ProductNavigationWrapper>
    <Section>
      {({ className }) => (
        <div className={className}>
          <AtlassianWordmark />
        </div>
      )}
    </Section>
    <Section>
      {({ className }) => (
        <div className={className}>
          <Item text="Dashboard" />
          <Item text="Things" />
          <Item text="Settings" />
          <SectionSeparator />
          <SectionTitle>Add-ons</SectionTitle>
          <Item text="My plugin" />
        </div>
      )}
    </Section>
  </ProductNavigationWrapper>
);

const MyContainerNavigation = () => (
  <ProductNavigationWrapper>
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
          <SectionSeparator />
          <SectionTitle>Shortcuts</SectionTitle>
          <Item before={ShortcutIcon} text="Team space" />
        </div>
      )}
    </Section>
  </ProductNavigationWrapper>
);

const ExpandToggleButton = () => (
  <NavigationSubscriber>
    {ui => (
      <button onClick={ui.toggleProductNav}>
        {ui.state.productNavIsCollapsed ? 'Expand' : 'Collapse'} product
        navigation
      </button>
    )}
  </NavigationSubscriber>
);

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={MyGlobalNavigation}
      productRootNavigation={MyProductNavigation}
      productContainerNavigation={MyContainerNavigation}
    >
      <div>
        <ExpandToggleButton />
      </div>
    </LayoutManager>
  </NavigationProvider>
);
