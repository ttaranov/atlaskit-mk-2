// @flow
import React from 'react';
import { mount, shallow } from 'enzyme';

import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  name,
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import InputWithAnalytics, {
  SingleLineTextInput,
} from '../SingleLineTextInput';

describe(name, () => {
  it('selects the input when select() is called', () => {
    const value = 'my-value';
    const wrapper = mount(
      <SingleLineTextInput isEditing onChange={() => {}} value={value} />,
    );

    wrapper.instance().select();

    const input = wrapper.find('input').instance();
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(value.length);
  });
});
describe('analytics - Input', () => {});
