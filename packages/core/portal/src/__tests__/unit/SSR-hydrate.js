// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import exenv from 'exenv';
import Portal from '../..';

jest.mock('exenv', () => ({
  canUseDom: jest.fn(),
}));

afterAll(() =>
  document
    .querySelectorAll('.atlaskit-portal')
    .forEach(e => e.parentNode && e.parentNode.removeChild(e)));

const App = () => (
  <div>
    <Portal>
      <h1>:wave:</h1>
    </Portal>
    <p>Hi everyone</p>
  </div>
);

test('should ssr then hydrate portal correctly', () => {
  exenv.canUseDom = false;
  // server-side
  const serverHTML = ReactDOMServer.renderToString(<App />);
  // client-side
  const elem = document.createElement('div');
  elem.innerHTML = serverHTML;
  exenv.canUseDom = true;
  ReactDOM.hydrate(<App />, elem);
  expect(elem.getElementsByTagName('h1')).toHaveLength(0);
  expect(document.getElementsByClassName('atlaskit-portal')).toHaveLength(1);
});
