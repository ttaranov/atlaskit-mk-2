'use strict';
import React from 'react';
import { mount } from 'enzyme';
import GoogleAnalyticsListener from '../GoogleAnalyticsListener.js';
import ReactGA from 'react-ga';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-ga');

test('Google Analytics event to compute Apdex should be called with value 100', () => {
  window.performance = {
    timing: {
      domContentLoadedEventEnd: 1000,
      navigationStart: 500,
    },
  };

  const wrapper = mount(
    <MemoryRouter>
      <GoogleAnalyticsListener>{null}</GoogleAnalyticsListener>
    </MemoryRouter>,
  );

  expect(ReactGA.event).toHaveBeenCalledWith({
    category: 'Performance',
    action: 'apdex',
    value: 100,
    nonInteraction: true,
  });
});

test('Google Analytics event to compute Apdex should be called with value 50', () => {
  window.performance = {
    timing: {
      domContentLoadedEventEnd: 2000,
      navigationStart: 500,
    },
  };

  const wrapper = mount(
    <MemoryRouter>
      <GoogleAnalyticsListener>{null}</GoogleAnalyticsListener>
    </MemoryRouter>,
  );

  expect(ReactGA.event).toHaveBeenCalledWith({
    category: 'Performance',
    action: 'apdex',
    value: 100,
    nonInteraction: true,
  });
});

test('Google Analytics event to compute Apdex should be called with value 0', () => {
  window.performance = {
    timing: {
      domContentLoadedEventEnd: undefined,
      navigationStart: undefined,
    },
  };

  const wrapper = mount(
    <MemoryRouter>
      <GoogleAnalyticsListener>{null}</GoogleAnalyticsListener>
    </MemoryRouter>,
  );

  expect(ReactGA.event).toHaveBeenCalledWith({
    category: 'Performance',
    action: 'apdex',
    value: 0,
    nonInteraction: true,
  });
});
