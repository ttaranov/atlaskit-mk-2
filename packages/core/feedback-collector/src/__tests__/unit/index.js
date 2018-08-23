// @flow

import React from 'react';
import { shallow } from 'enzyme';

import FeedbackCollector from '../..';

describe('Feedback collector', () => {
  it('should render the component', () => {
    const wrapper = shallow(<FeedbackCollector />);
    expect(wrapper).toBeDefined();
  });
});
