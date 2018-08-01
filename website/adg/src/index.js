//@flow
import React from 'react';
import { render } from 'react-dom';
import '@atlaskit/css-reset';
import Adg from './containers/Adg';

render(<Adg />, document.getElementById('app'));

// import React from 'react';
// import { render } from 'react-dom';
// import { Router, Link } from '@reach/router';

// let Home = () => <div>Home</div>;
// let Dash = () => <div>Dash</div>;

// render(
//   <Router>
//     <Home path="/" />
//     <Dash path="dashboard" />
//   </Router>,
//   document.getElementById('app'),
// );
