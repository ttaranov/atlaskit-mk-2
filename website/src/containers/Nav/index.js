/* @flow */

import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, Switch, Route, matchPath } from 'react-router-dom';
import Navigation, {
  AkContainerTitle,
  presetThemes,
} from '@atlaskit/navigation';
import { borderRadius, colors } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';

import SearchIcon from '@atlaskit/icon/glyph/search';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import PackagesIcon from '@atlaskit/icon/glyph/component';
import DocumentationIcon from '@atlaskit/icon/glyph/overview';
import PatternsIcon from '@atlaskit/icon/glyph/issues';
import BitbucketIcon from '@atlaskit/icon/glyph/bitbucket';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';

import {
  RouterNavigationItem,
  ExternalNavigationItem,
} from './utils/linkComponents';
import atlasKitLogo from '../../assets/atlaskit-logo.png';
import { OLD_WEBSITE_URL } from '../../utils/constants';
import Groups from './Groups';
import GroupDrawer from './GroupDrawer';
import SearchDrawer from './SearchDrawer';
import { externalPackages as packages, docs, patterns } from '../../site';
import type { Directory } from '../../types';

import atlaskitLogo from '../../assets/atlaskit-logo-inverted.png';
import atlaskitLogoMonochrome from '../../assets/atlaskit-logo-monochrome.png';

type State = {
  groupDrawerOpen: boolean,
  searchDrawerOpen: boolean,
  searchDrawerValue: string,
};

const IconWrapper = styled.div`
  align-items: center;
  background-color: ${p => p.color};
  border-radius: ${borderRadius}px;
  display: flex;
  height: 40px;
  justify-content: center;
  width: 40px;
`;
const HeaderIcon = ({ icon: Icon, color, label }) => (
  <IconWrapper color={color}>
    <Icon label={label} primaryColor={colors.N0} />
  </IconWrapper>
);

const headers = {
  docs: {
    icon: DocumentationIcon,
    color: colors.P300,
    label: 'Documentation',
  },
  packages: {
    icon: PackagesIcon,
    color: colors.R300,
    label: 'Packages',
  },
  patterns: {
    icon: PatternsIcon,
    color: colors.G300,
    label: 'Patterns',
  },
};
const secondaryActions = [
  {
    href: 'https://bitbucket.org/atlassian/atlaskit',
    icon: BitbucketIcon,
    label: 'Atlaskit Repository',
  },
  {
    href: 'https://atlassian.design/',
    icon: DashboardIcon,
    label: 'Design guidelines',
  },
];
const SecondaryAnchor = styled.a`
  align-items: center;
  border-radius: 50%;
  display: flex;
  height: 32px;
  justify-content: center;
  width: 32px;

  &:hover {
    background-color: ${colors.N80A};
  }
`;
const SecondaryAction = ({ href, icon: Icon, label }) => (
  <Tooltip content={label} position="left">
    <SecondaryAnchor href={href} target="_blank">
      <Icon label={label} primaryColor={colors.N0} size="small" />
    </SecondaryAnchor>
  </Tooltip>
);
export const AtlaskitIcon = ({ monochrome }: { monochrome?: boolean }) => (
  <img
    alt="Atlaskit logo"
    height="24"
    src={monochrome ? atlaskitLogoMonochrome : atlaskitLogo}
    style={{ display: 'block' }}
    width="24"
  />
);

export default class Nav extends Component<{}, State> {
  state = {
    groupDrawerOpen: false,
    searchDrawerOpen: false,
    searchDrawerValue: '',
  };

  openGroupDrawer = () => this.setState({ groupDrawerOpen: true });
  closeGroupDrawer = () => this.setState({ groupDrawerOpen: false });

  openSearchDrawer = () => this.setState({ searchDrawerOpen: true });
  closeSearchDrawer = () =>
    this.setState({
      searchDrawerOpen: false,
      searchDrawerValue: '',
    });
  updateSearchValue = (e: SyntheticInputEvent<*>) =>
    this.setState({
      searchDrawerValue: e.target.value,
    });

  render() {
    const { groupDrawerOpen, searchDrawerOpen, searchDrawerValue } = this.state;

    return (
      <Switch>
        <Route
          render={({ location }) => {
            const fromOldSite = matchPath(
              location.pathname,
              '/packages/:group/:name',
            );
            const navigateOut = fromOldSite && fromOldSite.isExact;
            const containerNavAvailable = location.pathname !== '/';
            // const containerNavAvailable = true;
            const theme = containerNavAvailable ? null : presetThemes.global;
            const headerKey = location.pathname
              .replace('/mk-2', '')
              .split('/')
              .filter(p => p)[0];

            const header = headers[headerKey];

            const groups = (
              <Groups
                docs={docs}
                packages={packages}
                patterns={patterns}
                navigateOut={navigateOut}
              />
            );

            return (
              <Navigation
                isOpen={containerNavAvailable}
                containerTheme={theme}
                isCollapsible={!containerNavAvailable}
                isResizeable={false}
                globalPrimaryIcon={
                  <Tooltip content="Home" position="right">
                    <AtlaskitIcon />
                  </Tooltip>
                }
                globalCreateIcon={
                  <Tooltip content="Menu" position="right">
                    <MenuIcon label="Menu" />
                  </Tooltip>
                }
                globalPrimaryItemHref={navigateOut ? OLD_WEBSITE_URL : '/'}
                globalSearchIcon={
                  <Tooltip content="Search" position="right">
                    <SearchIcon label="search" />
                  </Tooltip>
                }
                globalSecondaryActions={secondaryActions.map(a => (
                  <SecondaryAction {...a} />
                ))}
                onSearchDrawerOpen={this.openSearchDrawer}
                onCreateDrawerOpen={this.openGroupDrawer}
                containerHeaderComponent={() =>
                  containerNavAvailable && (
                    <AkContainerTitle
                      icon={<HeaderIcon {...header} />}
                      text={header.label}
                      href={navigateOut ? OLD_WEBSITE_URL : `/${headerKey}`}
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
                  )
                }
                drawers={[
                  <SearchDrawer
                    isOpen={searchDrawerOpen}
                    closeDrawer={this.closeSearchDrawer}
                    searchDrawerValue={searchDrawerValue}
                    updateSearchValue={this.updateSearchValue}
                    packages={packages}
                    key="searchDrawer"
                  />,
                  <GroupDrawer
                    key="groupDrawer"
                    isOpen={groupDrawerOpen}
                    closeDrawer={this.closeGroupDrawer}
                    docs={docs}
                    pathname={location.pathname}
                    packages={packages}
                    patterns={patterns}
                    navigateOut={navigateOut}
                  >
                    {groups}
                  </GroupDrawer>,
                ]}
              >
                {containerNavAvailable && groups}
              </Navigation>
            );
          }}
        />
      </Switch>
    );
  }
}
