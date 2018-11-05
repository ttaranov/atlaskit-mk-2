// @flow

import React from 'react';
import { mount } from 'enzyme';

import PropertyToggle from '../../PropertyToggle';

describe('PropertyToggle', () => {
  it('should return `null` if lifecycle is NOT active', () => {
    expect(
      mount(
        <PropertyToggle isActive={false} styles={{ cursor: 'ew-resize' }} />,
      ).html(),
    ).toEqual(null);
  });
});
