import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';
import '@atlaskit/css-reset';
import 'regenerator-runtime/runtime';

import repo from './site';

import ExamplesIframe from './pages/Examples/iframe';

// $FlowFixMe
render(<ExamplesIframe />, document.getElementById('app'));
