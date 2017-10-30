/* @flow */

import React from 'react';
import { Switch, Route, matchPath } from 'react-router-dom';
import Navigation, { AkContainerTitle } from '@atlaskit/navigation';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import atlasKitLogo from '../../assets/atlaskit-logo.png';
import { OLD_WEBSITE_URL } from '../../utils/constants';
import Groups from './Groups';
import { packages, docs, patterns } from '../../site';
import type { Directory } from '../../types';

export default function Nav() {
  return (
    <Switch>
      <Route
        render={({ location }) => {
          const fromOldSite = matchPath(location.pathname, '/packages/:group/:name');
          const navigateOut = fromOldSite && fromOldSite.isExact;
          return (
            <Navigation
              globalPrimaryIcon={<AtlassianIcon size="large" label="AtlasKit" />}
              globalPrimaryItemHref={navigateOut ? OLD_WEBSITE_URL : '/'}
              containerHeaderComponent={() => (
                <AkContainerTitle
                  navigateOut={fromOldSite && fromOldSite.isExact}
                  icon={<img src={atlasKitLogo} alt="AtlasKit" />}
                  text="AtlasKit"
                />
              )}
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
