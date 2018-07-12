// @flow

import { mount } from 'enzyme';
import React from 'react';

import { AtlaskitThemeProvider, themed } from '../..';
import { colorPalette } from '../../colors';

describe('AtlaskitThemeProvider', () => {
  it('should mount', () => {
    expect(
      mount(
        <AtlaskitThemeProvider theme="light">
          <div />
        </AtlaskitThemeProvider>,
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

describe('colorPalette', () => {
  const palette8 = colorPalette('8');
  const palette16 = colorPalette('16');
  const palette24 = colorPalette('24');
  const paletteDefault = colorPalette();
  it('should return a function', () => {
    expect(typeof palette8).toBe('object');
  });
  it('should return an array of length 8', () => {
    expect(palette8.length).toBe(8);
  });
  it('should return an array of length 16', () => {
    expect(palette16.length).toBe(16);
  });
  it('should return an array of length 24', () => {
    expect(palette24.length).toBe(24);
  });
  it('should default to color palette 8', () => {
    expect(paletteDefault).toBe(palette8);
  });
});
