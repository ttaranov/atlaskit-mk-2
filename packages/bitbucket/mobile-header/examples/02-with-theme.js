// @flow

import { AtlaskitThemeProvider } from '@atlaskit/theme';
import React, { Component } from 'react';
import styled from 'styled-components';
import Button, { ButtonGroup } from '@atlaskit/button';
import Navigation from '@atlaskit/navigation';
import DetailViewIcon from '@atlaskit/icon/glyph/detail-view';
import MobileHeader from '../src';

const FakeSideBar = styled.div`
  background-color: white;
  height: 100vh;
  padding-top: 32px;
  text-align: center;
  width: 264px;
`;

type State = {
  drawerState: 'navigation' | 'sidebar' | 'none',
};

class MobileHeaderDemo extends Component<*, State> {
  state = {
    drawerState: 'none',
  };

  navOpened = () => {
    this.setState({ drawerState: 'navigation' });
  };

  sidebarOpened = () => {
    this.setState({ drawerState: 'sidebar' });
  };

  drawerClosed = () => {
    this.setState({ drawerState: 'none' });
  };

  render() {
    return (
      <MobileHeader
        drawerState={this.state.drawerState}
        menuIconLabel={'Menu'}
        navigation={isOpen => isOpen && <Navigation onResize={() => {}} />}
        secondaryContent={
          <ButtonGroup>
            <Button>One</Button>
            <Button
              iconBefore={<DetailViewIcon label="Show sidebar" />}
              onClick={this.sidebarOpened}
            />
          </ButtonGroup>
        }
        sidebar={isOpen =>
          isOpen && <FakeSideBar>Sidebar goes here...</FakeSideBar>
        }
        pageHeading="Page heading"
        onNavigationOpen={this.navOpened}
        onSidebarOpen={this.sidebarOpened}
        onDrawerClose={this.drawerClosed}
      />
    );
  }
}

export default function Example() {
  return (
    <AtlaskitThemeProvider mode="dark">
      <MobileHeaderDemo />
    </AtlaskitThemeProvider>
  );
}
