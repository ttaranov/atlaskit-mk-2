// @flow

import React from 'react';
import { mount, shallow } from 'enzyme';

import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import ProgressDotsWithAnalytics, {
  ProgressDots,
} from '../src/components/Dots';
import { IndicatorButton, IndicatorDiv } from '../src/styled/Dots';

// NOTE: "StubComponent" saves duplicating required props; avoids errors in the logs
const StubComponent = props => (
  <ProgressDots selectedIndex={0} values={['one', 'two', 'three']} {...props} />
);

describe('Progress Indicator', () => {
  it('should be possible to create a component', () => {
    const wrapper = shallow(<StubComponent />);
    expect(wrapper).not.toBe(undefined);
  });

  describe('size property', () => {
    it('should be "default" if unspecified', () => {
      const wrapper = shallow(<StubComponent />);
      expect(wrapper.prop('size')).toBe('default');
    });
  });

  describe('appearance property', () => {
    it('should be "default" if unspecified', () => {
      const wrapper = shallow(<StubComponent />);
      expect(wrapper.prop('appearance')).toBe('default');
    });
  });

  describe('values property', () => {
    it('should render the correct number of indicators', () => {
      const wrapper = shallow(
        <ProgressDots
          selectedIndex={0}
          values={['one', 'two', 'three', 'four', 'five']}
        />,
      );
      expect(wrapper.find(IndicatorDiv)).toHaveLength(5);
    });
    it('should accept an array of any value types', () => {
      const numericValues = shallow(
        <ProgressDots selectedIndex={0} values={[1, 2, 3]} />,
      );
      const objectValues = shallow(
        <ProgressDots
          selectedIndex={0}
          values={[{ key: 'value' }, { key: 'value' }, { key: 'value' }]}
        />,
      );
      expect(numericValues.find(IndicatorDiv)).toHaveLength(3);
      expect(objectValues.find(IndicatorDiv)).toHaveLength(3);
    });
  });

  describe('onSelect property', () => {
    it('should return an <IndicatorDiv /> when NOT specified', () => {
      const wrapper = mount(<StubComponent />);
      expect(wrapper.find(IndicatorDiv).exists()).toBe(true);
    });
    it('should return an <IndicatorButton /> when specified', () => {
      const wrapper = mount(<StubComponent onSelect={() => {}} />);
      expect(wrapper.find(IndicatorButton).exists()).toBe(true);
    });
  });

  describe('selectedIndex property', () => {
    it('should return a "selected" <Indicator* /> at the correct index', () => {
      const wrapper = mount(<StubComponent />);
      expect(
        wrapper
          .find(IndicatorDiv)
          .at(1)
          .prop('selected'),
      ).toBe(false);
      expect(
        wrapper
          .find(IndicatorDiv)
          .at(0)
          .prop('selected'),
      ).toBe(true);
    });
  });
});
describe('analytics - ProgressDots', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<ProgressDotsWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'progress-indicator',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onSelect handler', () => {});

  it('should fire an atlaskit analytics event on select', () => {});
});
