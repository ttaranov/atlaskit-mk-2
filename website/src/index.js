// @flow
import React from 'react';
import { render } from 'react-dom';

// $FlowFixMe Required module not found
import '@atlaskit/css-reset';
import 'regenerator-runtime/runtime';
import App from './containers/App';

// $FlowFixMe
render(<App />, document.getElementById('app'));
