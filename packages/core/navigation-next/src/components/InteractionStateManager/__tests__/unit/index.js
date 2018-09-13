// @flow

import { mount } from 'enzyme';
import React from 'react';
import InteractionStateManager from '../../index';

describe('InteractionStateManager', () => {
  it('should use the default values by default', () => {
    const wrapper = mount(
      <InteractionStateManager>
        {({ isActive, isHover, isClicked }) => (
          <div className="children">
            {isActive && <span className="active" />}
            {isHover && <span className="hover" />}
            {isClicked && <span className="clicked" />}
          </div>
        )}
      </InteractionStateManager>,
    );

    expect(wrapper.find('.children').text()).toBe('');
  });

  it('should change hover state when mouse is over the element', () => {
    const wrapper = mount(
      <InteractionStateManager>
        {({ isActive, isHover, isClicked }) => (
          <div className="children">
            {isActive && <span className="active" />}
            {isHover && <span className="hover" />}
            {isClicked && <span className="clicked" />}
          </div>
        )}
      </InteractionStateManager>,
    );

    wrapper.simulate('mouseover');

    expect(wrapper.state()).toEqual({
      isHover: true,
      isActive: false,
      isClicked: false,
    });
  });

  it('should change hover and click states when mouse is over and user clicks on the element', () => {
    const wrapper = mount(
      <InteractionStateManager>
        {({ isActive, isHover, isClicked }) => (
          <div className="children">
            {isActive && <span className="active" />}
            {isHover && <span className="hover" />}
            {isClicked && <span className="clicked" />}
          </div>
        )}
      </InteractionStateManager>,
    );

    wrapper.simulate('mouseover');
    wrapper.simulate('click');

    expect(wrapper.state()).toEqual({
      isHover: true,
      isActive: false,
      isClicked: true,
    });
  });

  it('should NOT change hover state if element was clicked', () => {
    const wrapper = mount(
      <InteractionStateManager>
        {({ isActive, isHover, isClicked }) => (
          <div className="children">
            {isActive && <span className="active" />}
            {isHover && <span className="hover" />}
            {isClicked && <span className="clicked" />}
          </div>
        )}
      </InteractionStateManager>,
    );

    wrapper.simulate('mouseover');
    wrapper.simulate('click');
    wrapper.simulate('mouseover');

    expect(wrapper.state()).toEqual({
      isHover: false,
      isActive: false,
      isClicked: true,
    });
  });
});
