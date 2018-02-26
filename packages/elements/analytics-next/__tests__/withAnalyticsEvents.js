// @flow

import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import {
  UIAnalyticsEvent,
  withAnalyticsEvents,
  type WithAnalyticsEventsProps,
} from '../src';

type WrappedProps = WithAnalyticsEventsProps & {
  children: any,
  onClick?: Function,
};

const Button = ({ children, onClick }: WrappedProps) => (
  <button onClick={onClick}>{children}</button>
);

// eslint-disable-next-line react/no-multi-comp
class ButtonWithCreate extends Component<WrappedProps> {
  handleClick = e => {
    const { createAnalyticsEvent, onClick } = this.props;
    if (onClick) {
      onClick(e, createAnalyticsEvent({ action: 'b' }));
    }
  };

  render() {
    return <button onClick={this.handleClick}>{this.props.children}</button>;
  }
}

it('should render the provided component', () => {
  const ButtonWithAnalytics = withAnalyticsEvents()(Button);
  const wrapper = shallow(<ButtonWithAnalytics>Hello</ButtonWithAnalytics>);

  expect(wrapper.html()).toBe('<button>Hello</button>');
});

it('should pass a createAnalyticsEvent function prop to the inner component', () => {
  const ButtonWithAnalytics = withAnalyticsEvents()(Button);
  const wrapper = shallow(<ButtonWithAnalytics>Hello</ButtonWithAnalytics>);

  expect(typeof wrapper.find(Button).prop('createAnalyticsEvent')).toBe(
    'function',
  );
});

describe('createAnalyticsEvent function prop', () => {
  it('should return a new UI Analytics Event with specified action and payload', () => {
    let analyticsEvent;

    const ButtonWithAnalytics = withAnalyticsEvents()(ButtonWithCreate);
    const wrapper = mount(
      <ButtonWithAnalytics
        onClick={(e, buttonAnalyticsEvent) => {
          analyticsEvent = buttonAnalyticsEvent;
        }}
      >
        Hello
      </ButtonWithAnalytics>,
    );

    wrapper.find('ButtonWithCreate').simulate('click');

    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    if (analyticsEvent) {
      expect(analyticsEvent.payload).toEqual({ action: 'b' });
    }
  });

  it('should retrieve analytics context and handlers from react context and pass through to event', () => {
    let analyticsEvent;
    const eventHandler = jest.fn();

    const ButtonWithAnalytics = withAnalyticsEvents()(ButtonWithCreate);
    const wrapper = mount(
      <ButtonWithAnalytics
        onClick={(e, buttonAnalyticsEvent) => {
          analyticsEvent = buttonAnalyticsEvent;
        }}
      >
        Hello
      </ButtonWithAnalytics>,
      {
        context: {
          getAtlaskitAnalyticsContext: () => [
            { a: 'b' },
            { c: 'd' },
            { a: 'e' },
          ],
          getAtlaskitAnalyticsEventHandlers: () => [eventHandler],
        },
      },
    );

    wrapper.find('ButtonWithCreate').simulate('click');

    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    if (analyticsEvent) {
      expect(analyticsEvent.context).toEqual([
        { a: 'b' },
        { c: 'd' },
        { a: 'e' },
      ]);
      expect(analyticsEvent.handlers).toEqual([eventHandler]);
    }
  });
});

describe('create event map', () => {
  it('should patch callback props to create an event when passed a string', () => {
    let analyticsEvent;
    const ButtonWithAnalytics = withAnalyticsEvents({
      onClick: {},
    })(Button);
    const wrapper = mount(
      <ButtonWithAnalytics
        onClick={(e, buttonAnalyticsEvent) => {
          analyticsEvent = buttonAnalyticsEvent;
        }}
      >
        Hello
      </ButtonWithAnalytics>,
    );

    wrapper.find('Button').simulate('click');

    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    if (analyticsEvent) {
      expect(analyticsEvent.payload).toEqual({});
    }
  });

  it('should patch callback props to create an event when passed a function', () => {
    let analyticsEvent;
    const ButtonWithAnalytics = withAnalyticsEvents({
      onClick: createEvent => createEvent({ a: 'b' }),
    })(Button);
    const wrapper = mount(
      <ButtonWithAnalytics
        onClick={(e, buttonAnalyticsEvent) => {
          analyticsEvent = buttonAnalyticsEvent;
        }}
      >
        Hello
      </ButtonWithAnalytics>,
    );

    wrapper.find('Button').simulate('click');

    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    if (analyticsEvent) {
      expect(analyticsEvent.payload).toEqual({ a: 'b' });
    }
  });

  it('should pass component props to create event map functions', () => {
    let analyticsEvent;
    const ButtonWithAnalytics = withAnalyticsEvents({
      onClick: (createEvent, props) => createEvent({ efg: props.abc }),
    })(Button);
    const wrapper = mount(
      <ButtonWithAnalytics
        abc="xyz"
        onClick={(e, buttonAnalyticsEvent) => {
          analyticsEvent = buttonAnalyticsEvent;
        }}
      >
        Hello
      </ButtonWithAnalytics>,
    );

    wrapper.find('Button').simulate('click');

    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    if (analyticsEvent) {
      expect(analyticsEvent.payload).toEqual({ efg: 'xyz' });
    }
  });
});
