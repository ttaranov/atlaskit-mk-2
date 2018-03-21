// @flow
import React from 'react';
import { mount } from 'enzyme';

import AtlaskitSelectWrapper from '../src/SelectWrapper';
import AtlaskitSelect from '../src';

const OPTIONS = [
  { label: '0', value: 'zero' },
  { label: '1', value: 'one' },
  { label: '2', value: 'two' },
  { label: '3', value: 'three' },
  { label: '4', value: 'four' },
];

test('validation state - success', () => {
  const atlaskitSelectWrapper = mount(
    <AtlaskitSelectWrapper
      id="success"
      validationState="success"
      validationMessage="yes, it is success!"
    >
      <AtlaskitSelect options={OPTIONS} defaultValue={OPTIONS[0]} />
    </AtlaskitSelectWrapper>,
  );
  expect(atlaskitSelectWrapper.find('EditorSuccessIcon').exists()).toBeTruthy();
  expect(atlaskitSelectWrapper.find('Notice').text()).toBe(
    'yes, it is success!',
  );
});

test('validation state - error', () => {
  const atlaskitSelectWrapper = mount(
    <AtlaskitSelectWrapper
      id="error"
      validationState="error"
      validationMessage="no, it is error!"
    >
      <AtlaskitSelect options={OPTIONS} defaultValue={OPTIONS[0]} />
    </AtlaskitSelectWrapper>,
  );
  expect(atlaskitSelectWrapper.find('ErrorIcon').exists()).toBeTruthy();
  expect(atlaskitSelectWrapper.find('Notice').text()).toBe('no, it is error!');
});
