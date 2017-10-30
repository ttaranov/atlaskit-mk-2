/* @flow */

import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import styled, { injectGlobal } from 'styled-components';
import type { Directory } from '../types';
import * as fs from '../utils/fs';

import Home from '../pages/Home';
import ChangeLogExplorer from '../pages/ChangeLogExplorer';
import Examples from '../pages/Examples';
import FourOhFour from '../pages/FourOhFour';
import Pattern from '../pages/Pattern';
import PatternsInfo from '../pages/PatternsInfo';
import Package from '../pages/Package';
import PackagesList from '../pages/PackagesList';
import PackageDocument from '../pages/PackageDocument';
import Document from '../pages/Document';
import Nav from './Nav';

// eslint-disable-next-line
injectGlobal`
  *, ::before, ::after {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  html, body, #app {
    position: relative;
    width: 100%;
    height: 100%;
  }

  body {
    margin: 0;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }
`;

const AppContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const AppContent = styled.div`
  position: absolute;
  left: 20rem;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
`;

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/examples/:groupId?/:pkgId?/:exampleId*" component={Examples} />
        <Route>
          <AppContainer>
            <Nav />
            <AppContent>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/docs/:docId*" component={Document} />
                <Route path="/patterns" component={PatternsInfo} exact />
                <Route path="/patterns/:patternId*" component={Pattern} />} />
                <Route
                  path="/mk-2/packages/:groupId/:pkgId/docs/:docId"
                  component={PackageDocument}
                />
                <Route path="/packages/:groupId/:pkgId" component={Package} />
                <Route path="/mk-2/packages/:groupId/:pkgId" component={Package} />
                <Route path="/packages" component={PackagesList} />
                <Route path="/changelog/:groupId/:pkgId/:semver?" component={ChangeLogExplorer} />
                <Route component={FourOhFour} />
              </Switch>
            </AppContent>
          </AppContainer>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
