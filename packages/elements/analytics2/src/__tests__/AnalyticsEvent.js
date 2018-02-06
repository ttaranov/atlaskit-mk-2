// @flow

import AnalyticsEvent from '../AnalyticsEvent';

it('should be constructed with both action and payload args', () => {
  const analyticsEvent = new AnalyticsEvent({
    action: 'click',
    payload: { a: 'b' },
  });
  expect(analyticsEvent).toEqual(expect.any(AnalyticsEvent));
  expect(analyticsEvent.action).toBe('click');
  expect(analyticsEvent.payload).toEqual({ a: 'b' });
});

it('can be cloned into a new event which has the same action and payload', () => {
  const analyticsEvent = new AnalyticsEvent({
    action: 'click',
    payload: {
      a: { b: 'c' },
    },
  });
  const clonedEvent = analyticsEvent.clone();
  expect(analyticsEvent.action).toEqual(clonedEvent.action);
  expect(analyticsEvent.payload).toEqual(clonedEvent.payload);
});

it('should deep clone event payloads when cloning', () => {
  const analyticsEvent = new AnalyticsEvent({
    action: 'click',
    payload: {
      a: { b: 'c' },
    },
  });
  const clonedEvent = analyticsEvent.clone();
  expect(analyticsEvent).not.toBe(clonedEvent);
  expect(analyticsEvent.payload).not.toBe(clonedEvent.payload);
  expect(analyticsEvent.payload.a).not.toBe(clonedEvent.payload.a);
});

it('payload can be updated with an object that is shallow merged', () => {
  const analyticsEvent = new AnalyticsEvent({
    action: 'click',
    payload: {
      a: { b: 'c' },
    },
  });
  analyticsEvent.update({ d: 'e' });
  expect(analyticsEvent.payload).toEqual({
    a: { b: 'c' },
    d: 'e',
  });

  analyticsEvent.update({ a: { f: 'g' } });
  expect(analyticsEvent.payload).toEqual({
    a: { f: 'g' },
    d: 'e',
  });
});

it('payload can be updated with a function', () => {
  const analyticsEvent = new AnalyticsEvent({
    action: 'click',
    payload: {
      a: { b: 'c' },
      d: 'e',
    },
  });

  analyticsEvent.update(payload => ({
    ...payload,
    a: {
      ...payload.a,
      f: 'g',
    },
  }));
  expect(analyticsEvent.payload).toEqual({
    a: { b: 'c', f: 'g' },
    d: 'e',
  });
});
