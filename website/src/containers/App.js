/* @flow */

import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import styled, { injectGlobal } from 'styled-components';
import LayerManager from '@atlaskit/layer-manager';

import type { Directory } from '../types';
import * as fs from '../utils/fs';

import Home from '../pages/Home';
import ChangeLogExplorer from '../pages/ChangeLogExplorer';
import Examples from '../pages/Examples';
import FourOhFour from '../pages/FourOhFour';
import Pattern from '../pages/Pattern';
import PatternsInfo from '../pages/PatternsInfo';
import Document from '../pages/Document';
import Package from '../pages/Package';
import PackagesList from '../pages/PackagesList';
import PackageDocument from '../pages/PackageDocument';
import ChangelogModal from '../pages/Package/ChangelogModal';
import ExamplesModal from '../pages/Package/ExamplesModal';
import GoogleAnalyticsListener from '../components/GoogleAnalyticsListener';

import Nav from './Nav';
import { GOOGLE_ANALYTICS_ID } from '../constants';

// eslint-disable-next-line
injectGlobal`
  body {
    margin: 0;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }

  #app {
    position: relative;
    width: 100%;
    height: 100%;
  }
`;

const AppContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const AppContent = styled.div`
  flex: 1 1 auto;
`;

const SiteAnlaytics = ({ children }) => {
  return (
    <GoogleAnalyticsListener gaId={GOOGLE_ANALYTICS_ID}>
      {children}
    </GoogleAnalyticsListener>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <SiteAnlaytics>
        <Switch>
          <Route
            path="/examples/:groupId?/:pkgId?/:exampleId*"
            component={Examples}
          />
          <Route>
            <LayerManager>
              <AppContainer>
                <Nav />
                <AppContent>
                  <Switch>
                    <Route
                      path="/mk-2"
                      render={props => (
                        <Redirect
                          to={props.location.pathname.replace('/mk-2', '')}
                        />
                      )}
                    />

                    <Route exact path="/" component={Home} />
                    <Route path="/docs/:docId*" component={Document} />
                    <Route path="/patterns" component={PatternsInfo} exact />
                    <Route path="/patterns/:patternId*" component={Pattern} />
                    <Route
                      path="/packages/:groupId/:pkgId/docs/:docId"
                      component={PackageDocument}
                    />
                    <Route
                      path="/packages/:groupId/:pkgId"
                      component={Package}
                    />
                    <Route path="/packages" component={PackagesList} />
                    <Route
                      path="/changelog/:groupId/:pkgId/:semver?"
                      component={ChangeLogExplorer}
                    />
                    <Route component={FourOhFour} />
                  </Switch>

                  <Route
                    path="/packages/:groupId/:pkgId/changelog/:semver?"
                    component={ChangelogModal}
                  />
                  <Route
                    path="/packages/:groupId/:pkgId/example/:exampleId"
                    component={ExamplesModal}
                  />
                </AppContent>
              </AppContainer>
            </LayerManager>
          </Route>
        </Switch>
      </SiteAnlaytics>
    </BrowserRouter>
  );
}
