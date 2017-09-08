// @flow
import * as React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Nav from './Nav';
import NavItem from './NavItem';
import Home from './Home';
import Package from './Package';
import ChangeLogExplorer from './ChangeLogExplorer';
import FourOhFour from './FourOhFour';
import { PACKAGES } from '../constants';
import { getUnscopedPkgName } from '../utils/packages';

/* eslint-disable no-unused-expressions */
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
/* eslint-enable no-unused-expressions */

const AppContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const AppNav = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 20rem;
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
          <AppNav>
            <Nav title="Packages">
              {PACKAGES.map(pkg => (
                <NavItem key={pkg.name} to={`/packages/${getUnscopedPkgName(pkg.name)}`}>
                  {pkg.name}
                </NavItem>
              ))}
            </Nav>
          </AppNav>
          <AppContent>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/packages/:name" component={Package} />
              <Route path="/changelog/:component/:semver?" component={ChangeLogExplorer} />
              <Route component={FourOhFour} />
            </Switch>
          </AppContent>
        </AppContainer>
      </BrowserRouter>
    );
  }
}
