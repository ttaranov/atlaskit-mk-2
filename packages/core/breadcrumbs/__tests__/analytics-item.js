// @flow
import { mount } from 'enzyme';
import React from 'react';
import Button from '@atlaskit/button';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import { BreadcrumbsItem } from '../src/components/BreadcrumbsItem';

// This is a global mock for this file that will mock all components wrapped with analytics
// and replace them with an empty SFC that returns null. This includes components imported
// directly in this file and others imported as dependencies of those imports.
jest.mock('@atlaskit/analytics-next', () => ({
  withAnalyticsEvents: jest.fn(() => jest.fn(() => () => null)),
  withAnalyticsContext: jest.fn(() => jest.fn(() => () => null)),
  createAndFireEvent: jest.fn(() => jest.fn(args => args)),
}));

describe('BreadcrumbsItem', () => {
  it('should override the existing analytics context of Button', () => {
    const wrapper = mount(<BreadcrumbsItem />);

    expect(wrapper.find(Button).prop('analyticsContext')).toEqual({
      component: 'breadcrumbs-item',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should be wrapped with analytics events', () => {
    expect(createAndFireEvent).toHaveBeenCalledWith('atlaskit');
    expect(withAnalyticsEvents).toHaveBeenCalledWith({
      onClick: { action: 'click' },
    });
  });
});
