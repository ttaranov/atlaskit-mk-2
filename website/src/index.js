// @flow
import * as React from 'react';
import {render} from 'react-dom';
import badgeDocsIntro from '../../components/badge/docs/0-intro.js';

function App() {
  return <div>{badgeDocsIntro}</div>;
}

render(<App/>, document.getElementById('root'));
