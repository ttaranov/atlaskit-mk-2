// @flow

import React from 'react';
import { shallow, mount } from 'enzyme';
import withCreateAnalyticsEvent from '../withCreateAnalyticsEvent';
import UIAnalyticsEvent from '../UIAnalyticsEvent';

type WrappedProps = {
  children: any,
  onClick?: Function,
  // TODO: Properly type this in withCreateAnalyticsEvent and export types for it
  createAnalyticsEvent?: Function,
};

const Button = ({ children, onClick }: WrappedProps) => (
  <button onClick={onClick}>{children}</button>
);

const ButtonWithCreate = ({
  children,
  createAnalyticsEvent,
  onClick: propsOnClick,
}: WrappedProps) => {
  const onClick = e =>
    propsOnClick(
      e,
      createAnalyticsEvent && createAnalyticsEvent('click', { a: 'b' }),
    );
  return <button onClick={onClick}>{children}</button>;
};

it('should render the provided component', () => {
  const ButtonWithAnalytics = withCreateAnalyticsEvent()(Button);
  const wrapper = shallow(<ButtonWithAnalytics>Hello</ButtonWithAnalytics>);

  expect(wrapper.html()).toBe('<button>Hello</button>');
});

it('should pass a createAnalyticsEvent function prop to the inner component', () => {
  const ButtonWithAnalytics = withCreateAnalyticsEvent()(Button);
  const wrapper = shallow(<ButtonWithAnalytics>Hello</ButtonWithAnalytics>);

  expect(typeof wrapper.find(Button).prop('createAnalyticsEvent')).toBe(
    'function',
  );
});

describe('createAnalyticsEvent function prop', () => {
  it('should return a new UI Analytics Event with specified action and payload', () => {
    let analyticsEvent;

    const ButtonWithAnalytics = withCreateAnalyticsEvent()(ButtonWithCreate);
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
      expect(analyticsEvent.action).toBe('click');
      expect(analyticsEvent.payload).toEqual({ a: 'b' });
    }
  });

  it('should retrieve analytics context and handlers from react context and pass through to event', () => {
    let analyticsEvent;
    const eventHandler = jest.fn();

    const ButtonWithAnalytics = withCreateAnalyticsEvent()(ButtonWithCreate);
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
          getAnalyticsContext: () => [{ a: 'b' }, { c: 'd' }, { a: 'e' }],
          getAnalyticsEventHandlers: () => [eventHandler],
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
    const ButtonWithAnalytics = withCreateAnalyticsEvent({
      onClick: 'click',
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
      expect(analyticsEvent.action).toBe('click');
      expect(analyticsEvent.payload).toEqual({});
    }
  });

  it('should patch callback props to create an event when passed a function', () => {
    let analyticsEvent;
    const ButtonWithAnalytics = withCreateAnalyticsEvent({
      onClick: createEvent => createEvent('click', { a: 'b' }),
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
      expect(analyticsEvent.action).toBe('click');
      expect(analyticsEvent.payload).toEqual({ a: 'b' });
    }
  });

  it('should pass component props to create event map functions', () => {
    let analyticsEvent;
    const ButtonWithAnalytics = withCreateAnalyticsEvent({
      onClick: (createEvent, props) => createEvent('click', { efg: props.abc }),
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
      expect(analyticsEvent.action).toBe('click');
      expect(analyticsEvent.payload).toEqual({ efg: 'xyz' });
    }
  });
});
