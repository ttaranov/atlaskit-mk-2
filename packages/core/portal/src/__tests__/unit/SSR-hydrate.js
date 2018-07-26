// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import Portal from '../..';
import canUseDOM from '../../utils/canUseDOM';

jest.mock('../../utils/canUseDOM');

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
  // $FlowFixMe - flow can't tell canUseDOM is a jest mock function
  canUseDOM.mockReturnValueOnce(false).mockReturnValueOnce(true);
  // server-side
  const serverHTML = ReactDOMServer.renderToString(<App />);
  // client-side
  const elem = document.createElement('div');
  elem.innerHTML = serverHTML;
  ReactDOM.hydrate(<App />, elem);
  expect(elem.getElementsByTagName('h1')).toHaveLength(0);
  expect(document.getElementsByClassName('atlaskit-portal')).toHaveLength(1);
});
