// @flow

import React, { Component } from 'react';
import GlobalNavigation from '@atlaskit/global-navigation';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { AtlassianWordmark } from '@atlaskit/logo';
import { ThemeProvider } from 'emotion-theming';
import { colors } from '@atlaskit/theme';

import {
  ContainerHeader,
  GroupHeading,
  Item,
  ItemAvatar,
  LayoutManager,
  NavigationProvider,
  Section,
  Separator,
  light,
  dark,
  settings,
  modeGenerator,
} from '../src';

const custom = modeGenerator({
  text: colors.N0,
  background: colors.G500,
});

const themeModes = { light, dark, settings, custom };

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
          <Item text="Some other thing selected" isSelected />
          <Separator />
          <GroupHeading>Shortcuts</GroupHeading>
          <Item before={ShortcutIcon} text="Team space" />
        </div>
      )}
    </Section>
  </div>
);

type State = {
  themeMode: 'light' | 'dark' | 'settings' | 'custom',
};

export default class Example extends Component<{}, State> {
  state = {
    themeMode: 'light',
  };

  handleThemeModeChange = ({ target: { value: themeMode } }: any) => {
    this.setState({ themeMode });
  };

  render() {
    const { themeMode } = this.state;
    return (
      <NavigationProvider>
        <ThemeProvider
          theme={theme => ({
            ...theme,
            mode: themeModes[themeMode],
          })}
        >
          <LayoutManager
            globalNavigation={MyGlobalNavigation}
            productNavigation={MyProductNavigation}
            containerNavigation={MyContainerNavigation}
          >
            <div>Page content goes here.</div>
            <p> Change theme to:</p>
            <select onChange={this.handleThemeModeChange} value={themeMode}>
              <option value="light">Light mode</option>
              <option value="dark">Dark mode</option>
              <option value="settings">Settings mode</option>
              <option value="custom">Custom mode</option>
            </select>
          </LayoutManager>
        </ThemeProvider>
      </NavigationProvider>
    );
  }
}
