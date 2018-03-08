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

import SingleLineTextInputWithAnalytics, {
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
describe('analytics - SingleLineTextInput', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<SingleLineTextInputWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'input',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onConfirm handler', () => {});

  it('should pass analytics event as last argument to onKeyDown handler', () => {});

  it('should fire an atlaskit analytics event on confirm', () => {});

  it('should fire an atlaskit analytics event on keydown', () => {});
});
