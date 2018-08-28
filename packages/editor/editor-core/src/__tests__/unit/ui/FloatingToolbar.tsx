import * as React from 'react';
import { mount } from 'enzyme';
import { Popup } from '@atlaskit/editor-common';
import FloatingToolbar from '../../../ui/FloatingToolbar';
import { Container } from '../../../ui/FloatingToolbar/styles';

describe('FloatingToolbar', () => {
  const target = document.createElement('div');

  it('renders nothing if there is no target', () => {
    const wrapper = mount(<FloatingToolbar />);
    expect(wrapper.find(Popup).length).toBe(0);
  });

  it('renders popup', () => {
    const wrapper = mount(<FloatingToolbar target={target} />);
    expect(wrapper.find(Popup).length).toBe(1);
  });

  it('renders container', () => {
    const wrapper = mount(<FloatingToolbar target={target} />);
    expect(wrapper.find(Container).length).toBe(1);
  });

  it('passes height to popup', () => {
    const wrapper = mount(<FloatingToolbar target={target} fitHeight={30} />);
    expect(wrapper.find(Popup).props().fitHeight).toBe(30);
  });

  it('passes height to container', () => {
    const wrapper = mount(<FloatingToolbar target={target} fitHeight={32} />);
    expect(wrapper.find(Container).props().height).toBe(32);
  });
});
