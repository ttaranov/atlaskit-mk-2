// @flow

import { mount } from 'enzyme';
import React from 'react';
import InteractionStateManager from '../../index';

describe('InteractionStateManager', () => {
  it('should use the default values by default', () => {
    const wrapper = mount(
      <InteractionStateManager>
        {({ isActive, isHover, isSelected }) => (
          <div className="children">
            {isActive && <span className="active" />}
            {isHover && <span className="hover" />}
            {isSelected && <span className="clicked" />}
          </div>
        )}
      </InteractionStateManager>,
    );

    expect(wrapper.find('.children').text()).toBe('');
  });

  it('should change hover state when mouse is over the element', () => {
    const wrapper = mount(
      <InteractionStateManager>
        {({ isActive, isHover, isSelected }) => (
          <div className="children">
            {isActive && <span className="active" />}
            {isHover && <span className="hover" />}
            {isSelected && <span className="clicked" />}
          </div>
        )}
      </InteractionStateManager>,
    );

    wrapper.simulate('mouseover');

    expect(wrapper.state()).toEqual({
      isHover: true,
      isActive: false,
      isSelected: false,
    });
  });

  it('should change hover and active states when mouse is over and user starts click event on the element', () => {
    const wrapper = mount(
      <InteractionStateManager>
        {({ isActive, isHover, isSelected }) => (
          <div className="children">
            {isActive && <span className="active" />}
            {isHover && <span className="hover" />}
            {isSelected && <span className="clicked" />}
          </div>
        )}
      </InteractionStateManager>,
    );
    const preventDefault = jest.fn();
    wrapper.simulate('mouseover');
    wrapper.simulate('mousedown', { preventDefault });

    expect(wrapper.state()).toEqual({
      isHover: true,
      isActive: true,
      isSelected: false,
    });
  });

  it('should NOT change hover state if element was clicked', () => {
    const wrapper = mount(
      <InteractionStateManager>
        {({ isActive, isHover, isSelected }) => (
          <div className="children">
            {isActive && <span className="active" />}
            {isHover && <span className="hover" />}
            {isSelected && <span className="clicked" />}
          </div>
        )}
      </InteractionStateManager>,
    );

    const preventDefault = jest.fn();
    wrapper.simulate('mouseover');
    wrapper.simulate('mousedown', { preventDefault });
    wrapper.simulate('mouseup', { preventDefault });
    wrapper.simulate('mouseover');

    expect(wrapper.state()).toEqual({
      isHover: false,
      isActive: false,
      isSelected: true,
    });
  });
});
