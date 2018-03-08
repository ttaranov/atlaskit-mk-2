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
} from '../package.json';

import MultiSelectStatelessWithAnalytics, {
  MultiSelectStateless,
} from '../src/components/Stateless';

describe(`${name} - stateless`, () => {
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  describe('behavior', () => {
    let select;
    beforeEach(() => {
      select = mount(<MultiSelectStateless />);
    });

    describe('focus', () => {
      it('should focus the input field if shouldFocus is set to true', () => {
        const input = select.find('input');
        expect(document.activeElement).not.toBe(input.instance());
        select.setProps({ shouldFocus: true });
        expect(document.activeElement).toBe(input.instance());
      });
    });
  });
});
describe('analytics - MultiSelectStateless', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<MultiSelectStatelessWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'multi-select',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onFilterChange handler', () => {});

  it('should pass analytics event as last argument to onNewItemCreated handler', () => {});

  it('should pass analytics event as last argument to onSelectedChange handler', () => {});

  it('should pass analytics event as last argument to onOpenChange handler', () => {});

  it('should fire an atlaskit analytics event on filter', () => {});

  it('should fire an atlaskit analytics event on createItem', () => {});

  it('should fire an atlaskit analytics event on change', () => {});

  it('should fire an atlaskit analytics event on toggle', () => {});
});
