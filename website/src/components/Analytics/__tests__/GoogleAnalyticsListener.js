import React from 'react';
import { mount } from 'enzyme';
import GoogleAnalyticsListener from '../GoogleAnalyticsListener.js';
import ReactGA from 'react-ga';
import { MemoryRouter } from 'react-router-dom';

it('should get feature flag value', () => {
  const variation = jest.fn().mockReturnValueOnce(true);

  const someFunction = jest.fn();

  ReactGA.initialize = jest.fn();
  ReactGA.event = someFunction;

  const children = jest.fn();
  const wrapper = mount(
    <MemoryRouter>
      <GoogleAnalyticsListener>{null}</GoogleAnalyticsListener>
    </MemoryRouter>,
  );

  // expect(someFunction.mock.calls.length).toBe(1);
});
