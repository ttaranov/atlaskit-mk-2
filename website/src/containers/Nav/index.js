// @flow

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Navigation, { AkContainerTitle } from '@atlaskit/navigation';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import atlasKitLogo from '../../assets/atlaskit-logo.png';
import Groups from './Groups';
import type { List } from '../../utils/examples';
import type { Packages } from '../../types';

export type NavProps = {
  docs: any,
  packages: Packages,
  patterns: Array<List>,
};

export default function Nav(props: NavProps) {
  return (
    <Navigation
      globalPrimaryIcon={<AtlassianIcon size="large" label="AtlasKit" />}
      globalPrimaryItemHref="/"
      containerHeaderComponent={() => (
        <AkContainerTitle icon={<img src={atlasKitLogo} alt="AtlasKit" />} text="AtlasKit" />
      )}
    >
      <Switch>
        <Route
          render={({ location }) =>
            <Groups
              pathname={location.pathname}
              docs={props.docs}
              packages={props.packages}
              patterns={props.patterns}
            />}
        />
      </Switch>
    </Navigation>
  );
}
