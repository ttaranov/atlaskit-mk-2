// @flow
import { mount } from 'enzyme';
import React from 'react';
import Droplist from '@atlaskit/droplist';
import {
  withAnalyticsEvents,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import { DropdownMenuStateless } from '../src/components/DropdownMenuStateless';

// This is a global mock for this file that will mock all components wrapped with analytics
// and replace them with an empty SFC that returns null. This includes components imported
// directly in this file and others imported as dependencies of those imports.
jest.mock('@atlaskit/analytics-next', () => ({
  withAnalyticsEvents: jest.fn(() => jest.fn(() => () => null)),
  withAnalyticsContext: jest.fn(() => jest.fn(() => () => null)),
  createAndFireEvent: jest.fn(() => jest.fn(args => args)),
}));

describe('DropdownMenuStateless', () => {
  it('should override the existing analytics context of Droplist', () => {
    const wrapper = mount(<DropdownMenuStateless />);

    expect(wrapper.find(Droplist).prop('analyticsContext')).toEqual({
      component: 'dropdown-menu',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should be wrapped with analytics events', () => {
    expect(createAndFireEvent).toHaveBeenCalledWith('atlaskit');
    expect(withAnalyticsEvents).toHaveBeenCalledWith({
      onOpenChange: { action: 'toggle' },
    });
  });
});
