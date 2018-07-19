// @flow
import React, { type Node } from 'react';
import { mount } from 'enzyme';
import Portal from '../..';

const App = ({ children }: { children: Node }) => <div>{children}</div>;

let wrapper: any;

afterEach(() => wrapper && wrapper.unmount());

test('should create a portal', () => {
  wrapper = mount(
    <App>
      <Portal>
        <div>Hi</div>
      </Portal>
    </App>,
  );
  const elements = document.getElementsByClassName('atlaskit-portal-default');
  expect(wrapper.find(App).html()).toBe('<div></div>');
  expect(elements).toHaveLength(1);
  expect(elements[0].innerHTML).toBe('<div>Hi</div>');
  wrapper.unmount();
});

test('should stack nested portals', () => {
  wrapper = mount(
    <App>
      <Portal>
        <div>back</div>
        <Portal>
          <div>front</div>
        </Portal>
      </Portal>
    </App>,
  );
  const elements = document.getElementsByClassName('atlaskit-portal-default');
  expect(wrapper.find(App).html()).toBe('<div></div>');
  expect(elements).toHaveLength(2);
  expect(elements[0].innerHTML).toBe('<div>back</div>');
  expect(elements[1].innerHTML).toBe('<div>front</div>');
});

test('should stack sibiling portals', () => {
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
  const elements = document.getElementsByClassName('atlaskit-portal-default');
  expect(wrapper.find(App).html()).toBe('<div></div>');
  expect(elements).toHaveLength(2);
  expect(elements[0].innerHTML).toBe('<div>back</div>');
  expect(elements[1].innerHTML).toBe('<div>front</div>');
});

test('should layer portals', () => {
  wrapper = mount(
    <App>
      <Portal layer="tooltip">
        <div>front</div>
      </Portal>
      <Portal>
        <div>back</div>
      </Portal>
    </App>,
  );
  const defaultElements = document.getElementsByClassName(
    'atlaskit-portal-default',
  );
  const tooltipElements = document.getElementsByClassName(
    'atlaskit-portal-tooltip',
  );
  expect(wrapper.find(App).html()).toBe('<div></div>');
  expect(defaultElements).toHaveLength(1);
  expect(tooltipElements).toHaveLength(1);
  expect(defaultElements[0].innerHTML).toBe('<div>back</div>');
  expect(tooltipElements[0].innerHTML).toBe('<div>front</div>');
});
