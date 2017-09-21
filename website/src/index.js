// @flow
import * as React from 'react';
import { render } from 'react-dom';
import '@atlaskit/css-reset';
import 'regenerator-runtime/runtime';
import App from './components/App';

render(
  <App />,
  document.getElementById('app'),
);
