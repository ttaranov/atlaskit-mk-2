// @flow

import React from 'react';
import { mount } from 'enzyme';
import NotificationDrawer from '../../index';

describe('NotificationDrawerContents', () => {
  it('should add the correct url to the iframe', () => {
    const wrapper = mount(<NotificationDrawer locale="en" product="jira" />);

    expect(
      wrapper
        .find('iframe')
        .props()
        .src.endsWith(
          '/home/notificationsDrawer/iframe.html?locale=en&product=jira',
        ),
    ).toBeTruthy();
  });

  it('should add spinner when iframe is loading', () => {
    const wrapper = mount(<NotificationDrawer locale="en" product="jira" />);

    expect(wrapper.find('Spinner').exists()).toBeTruthy();
  });

  it('should remove spinner when iframe is finished loading', () => {
    const wrapper = mount(<NotificationDrawer locale="en" product="jira" />);

    wrapper.find('iframe').simulate('load');

    expect(wrapper.find('Spinner').exists()).toBeFalsy();
  });

  it('should add event listener when mounting', () => {
    const window = {
      addEventListener: jest.fn(),
    };
    const wrapper = mount(
      <NotificationDrawer locale="en" window={window} product="jira" />,
    );
    const { handleMessage } = wrapper.instance();

    expect(window.addEventListener).toHaveBeenCalledWith(
      'message',
      handleMessage,
    );
  });

  it('should remove event listener when unmounting', () => {
    const window = {
      removeEventListener: jest.fn(),
      addEventListener: () => {},
    };
    const wrapper = mount(
      <NotificationDrawer locale="en" window={window} product="jira" />,
    );
    const { handleMessage } = wrapper.instance();

    wrapper.unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'message',
      handleMessage,
    );
  });
});
