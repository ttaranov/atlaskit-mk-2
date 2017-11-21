// @flow

import { mount } from 'enzyme';
import React from 'react';

import { AtlasKitThemeProvider, themed } from '../';

describe('AtlasKitThemeProvider', () => {
  it('should mount', () => {
    expect(
      mount(
        <AtlasKitThemeProvider theme="light">
          <div />
        </AtlasKitThemeProvider>,
      ).prop('theme'),
    ).toBe('light');
  });
});

describe('themed', () => {
  const blackOrWhite = themed({ light: 'white', dark: 'black' });
  it('should return a function', () => {
    expect(typeof blackOrWhite).toBe('function');
  });
  it('should default to the light theme', () => {
    expect(blackOrWhite()).toBe('white');
  });
});
