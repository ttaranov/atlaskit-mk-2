// @flow

import React from 'react';
import GlobalNavigation from '@atlaskit/global-navigation';
import AtlassianIcon from '@atlaskit/logo';
import { AtlassianWordmark } from '@atlaskit/logo';
import {
  GroupHeading,
  Item,
  LayoutManager,
  NavigationProvider,
  Section,
  Separator,
} from '../src';

const MyGlobalNavigation = () => (
  <GlobalNavigation productIcon={AtlassianIcon} onProductClick={() => {}} />
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

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={MyGlobalNavigation}
      productNavigation={MyProductNavigation}
      containerNavigation={null}
    >
      <div>Page content goes here.</div>
    </LayoutManager>
  </NavigationProvider>
);
