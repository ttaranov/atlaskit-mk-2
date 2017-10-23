/* @flow */

import React from 'react';
import { Switch, Route, matchPath } from 'react-router-dom';
import Navigation, { AkContainerTitle } from '@atlaskit/navigation';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import atlasKitLogo from '../../assets/atlaskit-logo.png';
import { OLD_WEBSITE_URL } from '../../utils/constants';
import Groups from './Groups';
import type { Directory } from '../../types';

export type NavProps = {
  docs: Directory,
  packages: Directory,
  patterns: Directory,
};

export default function Nav(props: NavProps) {
  return (
    <Switch>
      <Route
        render={({ location }) => {
          const fromOldSite = matchPath(location.pathname, '/packages/:group/:name')
          const navigateOut = fromOldSite && fromOldSite.isExact
          return (
            <Navigation
              globalPrimaryIcon={<AtlassianIcon size="large" label="AtlasKit" />}
              globalPrimaryItemHref={navigateOut ? OLD_WEBSITE_URL : "/"}
              containerHeaderComponent={() => (
                <AkContainerTitle
                  navigateOut={fromOldSite && fromOldSite.isExact}
                  icon={<img src={atlasKitLogo} alt="AtlasKit" />}
                  text="AtlasKit"
                />
              )}
            >
            <Groups
              docs={props.docs}
              packages={props.packages}
              patterns={props.patterns}
              navigateOut={navigateOut}
            />
          </Navigation>
          )
        }
      }
    />

  </Switch>
  );
}
