// @flow

import React, { Fragment } from 'react';
import GlobalNavigation from '@atlaskit/global-navigation';
import { AtlassianIcon, AtlassianWordmark } from '@atlaskit/logo';
import {
  GroupHeading,
  Item,
  LayoutManager,
  NavigationProvider,
  Section,
  Separator,
} from '../src';

const MyGlobalNavigation = () => (
  <GlobalNavigation
    productIcon={() => <AtlassianIcon size="medium" />}
    onProductClick={() => {}}
  />
);

const MyProductNavigation = () => (
  <Fragment>
    <Section>
      {({ className }) => (
        <div className={className}>
          <div
            css={{
              lineHeight: 0,
              paddingBottom: 28,
              paddingLeft: 12,
              paddingTop: 28,
            }}
          >
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
  </Fragment>
);

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={MyGlobalNavigation}
      productNavigation={MyProductNavigation}
      containerNavigation={null}
    >
      <div css={{ padding: '32px 40px' }}>Page content goes here.</div>
    </LayoutManager>
  </NavigationProvider>
);
