// @flow
import React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import {
  withAnalyticsEvents,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { name, version } from '../package.json';
import { SubtleLinkWithoutAnalytics } from '../src/components/SubtleLink';

// This is a global mock for this file that will mock all components wrapped with analytics
// and replace them with an empty SFC that returns null. This includes components imported
// directly in this file and others imported as dependencies of those imports.
jest.mock('@atlaskit/analytics-next', () => ({
  withAnalyticsEvents: jest.fn(() => jest.fn(() => () => null)),
  withAnalyticsContext: jest.fn(() => jest.fn(() => () => null)),
  createAndFireEvent: jest.fn(() => jest.fn(args => args)),
}));

describe('@atlaskit comments', () => {
  describe('SubtleLink', () => {
    it('should override analytics context of button', () => {
      const wrapper = mount(
        <SubtleLinkWithoutAnalytics
          analyticsContext={{ component: 'comment-action' }}
        >
          Like
        </SubtleLinkWithoutAnalytics>,
      );
      const { analyticsContext } = wrapper.find(Button).props();
      expect(analyticsContext).toEqual({
        component: 'comment-action',
        package: name,
        version,
      });
    });
    it('should be wrapped with analytics events', () => {
      expect(createAndFireEvent).toHaveBeenCalledWith('atlaskit');
      expect(withAnalyticsEvents).toHaveBeenCalledWith({
        onClick: { action: 'click' },
        onFocus: { action: 'focus' },
        onMouseOver: { action: 'mouseover' },
      });
    });
  });
});
