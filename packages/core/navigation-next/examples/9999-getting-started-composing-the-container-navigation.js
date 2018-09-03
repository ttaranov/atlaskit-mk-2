// @flow

import React, { Fragment } from 'react';
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

const MyContainerNavigation = () => (
  <Fragment>
    <Section>
      {({ css }) => (
        <div css={{ ...css, paddingTop: 20, paddingBottom: 20 }}>
          <ContainerHeader
            before={itemState => (
              <ItemAvatar
                itemState={itemState}
                appearance="square"
                size="large"
              />
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
          <Item text="Some other thing selected" isSelected />
          <Separator />
          <GroupHeading>Shortcuts</GroupHeading>
          <Item before={ShortcutIcon} text="Team space" />
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
      containerNavigation={MyContainerNavigation}
    >
      <div css={{ padding: '32px 40px' }}>Page content goes here.</div>
    </LayoutManager>
  </NavigationProvider>
);
