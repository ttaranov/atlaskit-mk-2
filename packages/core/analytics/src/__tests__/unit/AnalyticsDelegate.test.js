// @flow
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */

import React, { Component } from 'react';
import { mount } from 'enzyme';

import { AnalyticsDelegate, cleanProps, withAnalytics } from '../..';

const Button = withAnalytics(
  class B extends Component<{
    fireAnalyticsEvent: (eventName: string) => {},
    firePrivateAnalyticsEvent: (eventName: string, eventData?: Object) => {},
  }> {
    onClick = () => {
      this.props.fireAnalyticsEvent('click');
      this.props.firePrivateAnalyticsEvent('private.button.click', {
        one: 1,
      });
    };
    render() {
      const props = cleanProps(this.props);
      return <button {...props} onClick={this.onClick} />;
    }
  },
);

describe('AnalyticsDelegate', () => {
  it('should ignore events if no delegateAnalyticsEvent callback', () => {
    const component = mount(
      <AnalyticsDelegate>
        <Button />
      </AnalyticsDelegate>,
    );
    component.find(Button).simulate('click');
  });

  it('should pass through public/private events', () => {
    const spy = jest.fn();
    const component = mount(
      <AnalyticsDelegate delegateAnalyticsEvent={spy}>
        <Button analyticsId="cheese" />
      </AnalyticsDelegate>,
    );
    component.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('cheese.click', {}, false);
    expect(spy).toHaveBeenCalledWith('private.button.click', { one: 1 }, true);
  });
});
