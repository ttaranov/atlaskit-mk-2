// @flow
import React, { type Node } from 'react';
import { mount } from 'enzyme';
import Portal from '../..';

const App = ({ children }: { children: Node }) => <div>{children}</div>;

it('should create a portal', () => {
  const element = document.createElement('div');
  const wrapper = mount(
    <App>
      <Portal getLayer={() => element}>
        <div>Hi</div>
      </Portal>
    </App>,
  );
  expect(wrapper.find(App).html()).toBe('<div></div>');
  expect(element.innerHTML).toBe('<div>Hi</div>');
});

it('should stack nested portals', () => {
  const element = document.createElement('div');
  const wrapper = mount(
    <App>
      <Portal getLayer={() => element}>
        <div>back</div>
        <Portal getLayer={() => element}>
          <div>front</div>
        </Portal>
      </Portal>
    </App>,
  );
  expect(wrapper.find(App).html()).toBe('<div></div>');
  expect(element.innerHTML).toBe('<div>back</div><div>front</div>');
});

it('should stack sibiling portals', () => {
  const element = document.createElement('div');
  const wrapper = mount(
    <App>
      <Portal getLayer={() => element}>
        <div>back</div>
      </Portal>
      <Portal getLayer={() => element}>
        <div>front</div>
      </Portal>
    </App>,
  );
  expect(wrapper.find(App).html()).toBe('<div></div>');
  expect(element.innerHTML).toBe('<div>back</div><div>front</div>');
});

it('should layer portals', () => {
  const layers = {
    default: document.createElement('div'),
    tooltip: document.createElement('div'),
  };
  const getLayer = layer => layers[layer];
  const wrapper = mount(
    <App>
      <Portal layer="tooltip" getLayer={getLayer}>
        <div>front</div>
      </Portal>
      <Portal getLayer={getLayer}>
        <div>back</div>
      </Portal>
    </App>,
  );
  expect(wrapper.find(App).html()).toBe('<div></div>');
  expect(layers.default.innerHTML).toBe('<div>back</div>');
  expect(layers.tooltip.innerHTML).toBe('<div>front</div>');
});
