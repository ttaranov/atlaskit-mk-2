'use strict';
import React from 'react';
import { mount } from 'enzyme';
import GoogleAnalyticsListener from '../../GoogleAnalyticsListener';
import ReactGA from 'react-ga';
import { MemoryRouter } from 'react-router-dom';
import cases from 'jest-in-case';

jest.mock('react-ga');

cases(
  'add(augend, addend)',
  ({ performance, expectedCallSignature }) => {
    window.performance = performance;

    window.addEventListener = (name, func, options) => {
      if (name === 'load') {
        func();
      }
    };

    const wrapper = mount(
      <MemoryRouter>
        <GoogleAnalyticsListener>{null}</GoogleAnalyticsListener>
      </MemoryRouter>,
    );

    expect(ReactGA.event).toHaveBeenCalledWith(expectedCallSignature);
  },
  [
    {
      name: 'apdex 100',
      performance: {
        timing: {
          domContentLoadedEventEnd: 1000,
          navigationStart: 500,
        },
      },
      expectedCallSignature: {
        category: 'Performance',
        action: 'apdex',
        value: 100,
        nonInteraction: true,
        label: 'seconds:0.5',
      },
    },
    {
      name: 'apdex 50',
      performance: {
        timing: {
          domContentLoadedEventEnd: 1600,
          navigationStart: 500,
        },
      },
      expectedCallSignature: {
        category: 'Performance',
        action: 'apdex',
        value: 50,
        nonInteraction: true,
        label: 'seconds:1.1',
      },
    },
    {
      name: 'apdex 0',
      performance: {
        timing: {
          domContentLoadedEventEnd: 5000,
          navigationStart: 500,
        },
      },
      expectedCallSignature: {
        category: 'Performance',
        action: 'apdex',
        value: 0,
        nonInteraction: true,
        label: 'seconds:4.5',
      },
    },
  ],
);
