import * as React from 'react';
import { Component } from 'react';
import { mount } from 'enzyme';

import { EventDispatcher } from '../../../event-dispatcher';
import connect from '../../../nodeviews/legacy-nodeview-factory/connect';

describe('connect', () => {
  class DummyComponent extends Component {
    renderCount = 0;
    render() {
      return ++this.renderCount;
    }
  }

  const eventDispatcher = new EventDispatcher();
  const ConnectedComponent = connect(DummyComponent, eventDispatcher);

  it('should pass all the props to the wrapped component', () => {
    const wrapper = mount(<ConnectedComponent x="1" y={2} />);
    expect(wrapper.find(DummyComponent).props()).toEqual({ x: '1', y: 2 });

    wrapper.unmount();
  });

  it('should pass change event payload to the wrapped component', () => {
    const wrapper = mount(<ConnectedComponent />);
    eventDispatcher.emit('change', { x: '3', y: 4 });
    wrapper.update();
    expect(wrapper.find(DummyComponent).props()).toEqual({ x: '3', y: 4 });

    wrapper.unmount();
  });

  it('should override props with change event payload', () => {
    const wrapper = mount(<ConnectedComponent x="1" y={2} />);
    eventDispatcher.emit('change', { y: 4 });
    wrapper.update();
    expect(wrapper.find(DummyComponent).props()).toEqual({ x: '1', y: 4 });

    wrapper.unmount();
  });

  it('should re-render the component on `change` event', () => {
    const wrapper = mount(<ConnectedComponent />);
    wrapper.update();
    expect(wrapper.text()).toBe('1');

    eventDispatcher.emit('change', {});
    wrapper.update();
    expect(wrapper.text()).toBe('2');

    // Passing same thing won't trigger the re-render hence these dummy values
    eventDispatcher.emit('change', { x: 1 });
    eventDispatcher.emit('change', { x: 2 });
    wrapper.update();
    expect(wrapper.text()).toBe('4');

    wrapper.unmount();
  });

  it('should not re-render the component on other events', () => {
    const wrapper = mount(<ConnectedComponent />);
    wrapper.update();
    expect(wrapper.text()).toBe('1');

    eventDispatcher.emit('fire', {});
    wrapper.update();
    expect(wrapper.text()).toBe('1');

    eventDispatcher.emit('render', { x: 1 });
    eventDispatcher.emit('re-render', { x: 2 });
    wrapper.update();
    expect(wrapper.text()).toBe('1');

    wrapper.unmount();
  });
});
