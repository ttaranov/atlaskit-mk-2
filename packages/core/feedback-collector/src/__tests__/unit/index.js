// @flow

import React from 'react';
import { mount } from 'enzyme';

import FeedbackCollector from '../../components/FeedbackCollector';

// TODO: later, add dedicated test for each questions

test('Feedback collector should render a component', () => {
  const wrapper = mount(
    <FeedbackCollector
      onClose={() => {}}
      onSubmit={() => {}}
      email={'email'}
      name={'name'}
      requestTypeId={'request_type_id'}
      embeddableKey={'embeddable_key'}
    />,
  );
  expect(wrapper).toBeDefined();
});
