// @flow

import { mount } from 'enzyme';
import React from 'react';

import Pattern from '..';

test('mounts', () => {
  expect(() => mount(<Pattern />)).not.toThrow();
});
