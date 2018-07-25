// @flow
import React, { type Node } from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { mount } from 'enzyme';
import Portal from '../..';

const App = ({ children }: { children: Node }) => <div>{children}</div>;

const zIndex = (elem: HTMLElement) =>
  parseInt(elem.style.getPropertyValue('z-index'), 10);

let wrapper: any;

afterEach(() => wrapper && wrapper.unmount());

afterAll(() =>
  document
    .querySelectorAll('.atlaskit-portal')
    .forEach(e => e.parentNode && e.parentNode.removeChild(e)));

test('should create a portal', () => {
  wrapper = mount(
    <App>
      <Portal>
        <div>Hi</div>
      </Portal>
    </App>,
  );
  const elements = document.getElementsByClassName('atlaskit-portal');
  expect(wrapper.find(App).html()).toBe('<div></div>');
  expect(elements).toHaveLength(1);
  expect(elements[0].innerHTML).toBe('<div>Hi</div>');
});

test('should use z-index to stack nested portals', () => {
  wrapper = mount(
    <App>
      <Portal>
        <div>back</div>
        <Portal zIndex={1}>
          <div>front</div>
        </Portal>
      </Portal>
    </App>,
  );
  const elements = document.getElementsByClassName('atlaskit-portal');
  expect(elements).toHaveLength(2);
  const [front, back] = elements;
  expect(zIndex(front)).toBeGreaterThan(zIndex(back));
});

test('should use DOM ordering to stack sibiling portals', () => {
  wrapper = mount(
    <App>
      <Portal>
        <div>back</div>
      </Portal>
      <Portal>
        <div>front</div>
      </Portal>
    </App>,
  );
  const elements = document.getElementsByClassName('atlaskit-portal');
  expect(elements).toHaveLength(2);
  const [back, front] = elements;
  expect(zIndex(front)).toEqual(zIndex(back));
  expect(back.nextSibling).toBe(front);
});

test('should hydrate portal correctly', () => {
  const SsrApp = ({ ssr = false }: { ssr?: boolean }) => (
    <div>
      <Portal ssr={ssr}>
        <h1>:wave:</h1>
      </Portal>
      <p>Hi everyone</p>
    </div>
  );
  // server-side
  const serverHTML = ReactDOMServer.renderToString(<SsrApp ssr />);
  // client-side
  const elem = document.createElement('div');
  elem.innerHTML = serverHTML;
  ReactDOM.hydrate(<SsrApp />, elem);
  expect(elem.getElementsByTagName('h1')).toHaveLength(0);
  expect(document.getElementsByClassName('atlaskit-portal')).toHaveLength(1);
});
