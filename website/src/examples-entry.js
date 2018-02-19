// @flow
import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';
// $FlowFixMe Required module not found
import '@atlaskit/css-reset';
import 'regenerator-runtime/runtime';

import repo from './site';

import ExamplesLoader from './pages/Examples/loader';

// $FlowFixMe
render(<ExamplesLoader />, document.getElementById('examples'));
