// @flow

import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import styled, { injectGlobal } from 'styled-components';

import { getList as getExampleList } from '../utils/examples';
import getDocs from '../utils/docs';
import { PACKAGES } from '../constants';
import Home from '../pages/Home';
import ChangeLogExplorer from '../pages/ChangeLogExplorer';
import Example from '../pages/Example';
import FourOhFour from '../pages/FourOhFour';
import Pattern from '../pages/Pattern';
import Package from '../pages/Package';
import PackagesList from '../pages/PackagesList';
import Doc from '../pages/Doc';
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

export type AppProps = {};
export default class App extends React.PureComponent<AppProps> {
  props: AppProps;

  render() {
    return (
      <BrowserRouter>
        <AppContainer>
          <Nav packages={PACKAGES} docs={getDocs()} patterns={getExampleList('patterns')} />
          <AppContent>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/docs/:group/:name?" component={Doc} />
              <Route path="/patterns/:example" component={Pattern} />
              <Route path="/packages/:group/:name/examples/:example" component={Example} />
              <Route path="/packages/:group/:name" component={Package} />
              <Route path="/packages" render={() => <PackagesList packages={PACKAGES} />} />
              <Route path="/changelog/:group/:name/:semver?" component={ChangeLogExplorer} />
              <Route component={FourOhFour} />
            </Switch>
          </AppContent>
        </AppContainer>
      </BrowserRouter>
    );
  }
}
