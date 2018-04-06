// @flow
import React from 'react';
import { render } from 'react-dom';
// $FlowFixMe Required module not found
import '@atlaskit/css-reset';

import ExamplesLoader from './pages/Examples/loader';

// $FlowFixMe
render(<ExamplesLoader />, document.getElementById('examples'));
