// @flow
import * as React from 'react';
import {render} from 'react-dom';
import badgeDocsIntro from '../../components/badge/docs/0-intro.js';
import codeDocsIntro from '../../components/code/docs/0-intro.tsx';

function App() {
  return (
    <div>{codeDocsIntro}</div>
  );
}

render(<App/>, document.getElementById('root'));
