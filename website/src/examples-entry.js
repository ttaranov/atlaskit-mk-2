// @flow
import React from 'react';
import { render } from 'react-dom';
import '@atlaskit/css-reset';

import ExamplesLoader from './pages/Examples/loader';

render(<ExamplesLoader />, document.getElementById('examples'));
