// @flow
import React from 'react';
import { shallow, mount } from 'enzyme';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import SubtleLink from '../src/components/SubtleLink';

describe('@atlaskit comments', () => {
  describe('SubtleLink', () => {
    it('should render a span and a button', () => {
      const wrapper = shallow(
        <SubtleLink analyticsContext={{}}>Like</SubtleLink>,
      ).dive();
      expect(wrapper).toMatchSnapshot();
    });

    describe('analytics events', () => {
      let onEvent;
      let wrapper;
      beforeEach(() => {
        onEvent = jest.fn();
        wrapper = mount(
          <AnalyticsListener channel="atlaskit" onEvent={onEvent}>
            <SubtleLink analyticsContext={{}}>Like</SubtleLink>
          </AnalyticsListener>,
        );
      });

      it('should fire on click', () => {
        wrapper.find(SubtleLink).simulate('click');
        expect(onEvent).toHaveBeenCalled();
      });

      it('should fire on focus', () => {
        wrapper.find(SubtleLink).simulate('focus');
        expect(onEvent).toHaveBeenCalled();
      });

      it('should fire on mouse over', () => {
        wrapper.find(SubtleLink).simulate('mouseover');
        expect(onEvent).toHaveBeenCalled();
      });
    });
  });
});
