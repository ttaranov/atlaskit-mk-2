// @flow
import React from 'react';
import { render } from 'react-dom';

import '@atlaskit/css-reset';
import 'regenerator-runtime/runtime';
import App from './containers/App';

render(<App />, document.getElementById('app'));
