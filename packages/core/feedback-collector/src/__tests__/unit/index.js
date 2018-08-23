// @flow

import React from 'react';
import { shallow } from 'enzyme';

import FeedbackCollector from '../..';

describe('Feedback collector', () => {
  it('should render the component', () => {
    const wrapper = shallow(
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
});
