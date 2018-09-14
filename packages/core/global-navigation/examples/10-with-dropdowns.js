// @flow

import React, { Component } from 'react';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';
import Button from '@atlaskit/button';

import GlobalNavigation from '../src';

const ExampleDropdown = () => (
  <DropdownItemGroup title="Heading">
    <DropdownItem>Hello it with some really quite long text here.</DropdownItem>
    <DropdownItem>Some text 2</DropdownItem>
    <DropdownItem isDisabled>Some disabled text</DropdownItem>
    <DropdownItem>Some more text</DropdownItem>
    <DropdownItem href="//atlassian.com" target="_new">
      A link item
    </DropdownItem>
  </DropdownItemGroup>
);

const GlobalNav = ({ url }: { url: string }) => (
  <GlobalNavigation
    helpItems={ExampleDropdown}
    profileItems={ExampleDropdown}
    profileIconUrl={url}
  />
);

type State = {
  url: string,
};
export default class Navigation extends Component<{}, State> {
  state = {
    url: 'https://api.adorable.io/avatars/285/abott@adorable.png',
  };
  changeAvatar = () => {
    this.setState({
      url: `https://api.adorable.io/avatars/285/${Math.floor(
        Math.random() * 27,
      ).toString(36)}@adorable.png`,
    });
  };

  render() {
    return (
      <NavigationProvider>
        <LayoutManager
          globalNavigation={() => <GlobalNav url={this.state.url} />}
          productNavigation={() => null}
          containerNavigation={() => null}
        >
          <div css={{ padding: '2rem' }}>
            <Button type="button" onClick={this.changeAvatar}>
              Change Avatar
            </Button>
          </div>
        </LayoutManager>
      </NavigationProvider>
    );
  }
}
