/* @flow */

import React from 'react';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import styled, { css, injectGlobal } from 'styled-components';
import LayerManager from '@atlaskit/layer-manager';
import { AtlaskitThemeProvider } from '@atlaskit/theme';
import { colors } from '@atlaskit/theme';

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

import ChangelogModal from '../pages/Package/ChangelogModal';
import ExamplesModal from '../pages/Package/ExamplesModal';

import Nav from './Nav';

// eslint-disable-next-line
injectGlobal`
  body {
    margin: 0;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }
`;
// TODO fix CORS font request, then add to global CSS
// @font-face {
//   font-family: LLCircularWeb-Book;
//   src: url(https://extranet.atlassian.com/download/attachments/2491682605/lineto-circular-book-s.eot);
//   src: url(https://extranet.atlassian.com/download/attachments/2491682605/lineto-circular-book-s.eot?#iefix) format("embedded-opentype"),url(https://extranet.atlassian.com/download/attachments/2491682605/lineto-circular-book-s.woff) format("woff"),url(https://extranet.atlassian.com/download/attachments/2491682605/lineto-circular-book-s.ttf) format("truetype"),url(https://extranet.atlassian.com/download/attachments/2491682605/lineto-circular-book-s.svg#LLCircularWeb-Book) format("svg");
//   font-weight: 400;
//   font-style: normal
// }
// @font-face {
//   font-family: LLCircularWeb-Medium;
//   src: url(https://extranet.atlassian.com/download/attachments/2491682605/lineto-circular-medium-s.eot);
//   src: url(https://extranet.atlassian.com/download/attachments/2491682605/lineto-circular-medium-s.eot?#iefix) format("embedded-opentype"),url(https://extranet.atlassian.com/download/attachments/2491682605/lineto-circular-medium-s.woff) format("woff"),url(https://extranet.atlassian.com/download/attachments/2491682605/lineto-circular-medium-s.ttf) format("truetype"),url(https://extranet.atlassian.com/download/attachments/2491682605/lineto-circular-medium-s.svg#LLCircularWeb-Medium) format("svg");
//   font-weight: 400;
//   font-style: normal
// }

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;
const AppContent = styled.div`
  flex: 1 1 auto;
`;
const StyleInjector = ({ location }) =>
  location.pathname === '/' && (
    <style>{`
  body {
    background-color: ${colors.B500};
  }
`}</style>
  );
const Style = withRouter(StyleInjector);

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/examples/:groupId?/:pkgId?/:exampleId*"
          component={Examples}
        />
        <Route>
          <LayerManager>
            <AtlaskitThemeProvider mode="light">
              <AppContainer>
                <Style />
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
                    <Route
                      path="/mk-2/packages/:groupId/:pkgId/changelog/:semver?"
                      component={ChangelogModal}
                    />
                    <Route
                      path="/mk-2/packages/:groupId/:pkgId/example/:exampleId"
                      component={ExamplesModal}
                    />
                  </Switch>
                </AppContent>
              </AppContainer>
            </AtlaskitThemeProvider>
          </LayerManager>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
