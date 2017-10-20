// @flow

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

export type AppProps = {
  repo: Directory,
};

export default class App extends React.PureComponent<AppProps> {
  props: AppProps;

  render() {
    let dirs = fs.getDirectories(this.props.repo.children);

    let docs = fs.getById(dirs, 'docs');
    let packages = fs.getById(dirs, 'packages');
    let patterns = fs.getById(dirs, 'patterns');

    return (
      <BrowserRouter>
        <Switch>
          <Route path="/examples/:groupId?/:packageId?/:exampleId*" render={props => (
            <Examples
              packages={packages}
              groupId={props.match.params.groupId}
              packageId={props.match.params.packageId}
              exampleId={props.match.params.exampleId}/>
          )} />
          <Route>
            <AppContainer>
              <Nav docs={docs} packages={packages} patterns={patterns} />
              <AppContent>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/docs/:docId*" render={props => (
                    <Document
                      docs={docs}
                      docId={props.match.params.docId} />
                  )} />
                  <Route path="/patterns" component={PatternsInfo} exact />
                  <Route path="/patterns/:patternId*" render={props => (
                    <Pattern
                      patterns={patterns}
                      patternId={props.match.params.patternId} />
                  )} />
                  <Route path="/packages/:group/:name" render={props => (
                    <Package
                      packages={packages}
                      groupId={props.match.params.group}
                      pkgId={props.match.params.name} />
                  )} />
                  <Route path="/old/packages/:group/:name" render={props => (
                    <Package
                      packages={packages}
                      groupId={props.match.params.group}
                      pkgId={props.match.params.name} />
                  )} />
                  <Route path="/packages" render={() => <PackagesList packages={packages} />} />
                  <Route path="/changelog/:group/:name/:semver?" component={ChangeLogExplorer} />
                  <Route component={FourOhFour} />
                </Switch>
              </AppContent>
            </AppContainer>
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}
