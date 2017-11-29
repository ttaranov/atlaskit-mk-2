/* @flow */

import React, { Component } from 'react';
import { Switch, Route, matchPath } from 'react-router-dom';
import Navigation, { AkContainerTitle } from '@atlaskit/navigation';
import { Link } from 'react-router-dom';

import SearchIcon from '@atlaskit/icon/glyph/search';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';

import {
  RouterNavigationItem,
  ExternalNavigationItem,
} from './utils/linkComponents';
import atlasKitLogo from '../../assets/atlaskit-logo.png';
import { OLD_WEBSITE_URL } from '../../utils/constants';
import Groups from './Groups';
import SearchDrawer from './SearchDrawer';
import { packages, docs, patterns } from '../../site';
import type { Directory } from '../../types';

type State = {
  searchDrawerOpen: boolean,
  searchDrawerValue: string,
};

export default class Nav extends Component<{}, State> {
  state = {
    searchDrawerOpen: false,
    searchDrawerValue: '',
  };

  openSearchDrawer = () => this.setState({ searchDrawerOpen: true });
  closeSearchDrawer = () =>
    this.setState({ searchDrawerOpen: false, searchDrawerValue: '' });
  updateSearchValue = (e: SyntheticInputEvent<*>) =>
    this.setState({ searchDrawerValue: e.target.value });

  render() {
    const { searchDrawerOpen, searchDrawerValue } = this.state;

    return (
      <Switch>
        <Route
          render={({ location }) => {
            const fromOldSite = matchPath(
              location.pathname,
              '/packages/:group/:name',
            );
            const navigateOut = fromOldSite && fromOldSite.isExact;
            return (
              <Navigation
                isCollapsible={false}
                isResizeable={false}
                globalPrimaryIcon={
                  <AtlassianIcon
                    size="large"
                    primaryColor="#DEEBFF"
                    label="Atlassian"
                  />
                }
                globalPrimaryItemHref={navigateOut ? OLD_WEBSITE_URL : '/'}
                globalSearchIcon={<SearchIcon label="search" />}
                onSearchDrawerOpen={this.openSearchDrawer}
                containerHeaderComponent={() => (
                  <AkContainerTitle
                    icon={<img src={atlasKitLogo} alt="Atlaskit" />}
                    text="Atlaskit"
                    href={navigateOut ? OLD_WEBSITE_URL : '/'}
                    linkComponent={
                      navigateOut
                        ? null
                        : ({ href, children, className }) => (
                            <Link to={href} className={className}>
                              {children}
                            </Link>
                          )
                    }
                  />
                )}
                drawers={[
                  <SearchDrawer
                    isOpen={searchDrawerOpen}
                    closeDrawer={this.closeSearchDrawer}
                    searchDrawerValue={searchDrawerValue}
                    updateSearchValue={this.updateSearchValue}
                    packages={packages}
                    key="searchDrawer"
                  />,
                ]}
              >
                <Groups
                  docs={docs}
                  packages={packages}
                  patterns={patterns}
                  navigateOut={navigateOut}
                />
              </Navigation>
            );
          }}
        />
      </Switch>
    );
  }
}
