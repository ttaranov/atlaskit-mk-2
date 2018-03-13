// @flow
import React from 'react';
import { shallow, mount } from 'enzyme';
import Button from '@atlaskit/button';
import { name, version } from '../package.json';
import {
  withAnalyticsEvents,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { SubtleLink } from '../src/components/SubtleLink';

// this mock will affect **all** components that are wrapped with analytics.
// it will turn all of these components into a sfc that looks like: () => null
jest.mock('@atlaskit/analytics-next', () => ({
  withAnalyticsEvents: jest.fn(() => jest.fn(() => () => null)),
  withAnalyticsContext: jest.fn(() => jest.fn(() => () => null)),
  createAndFireEvent: jest.fn(() => jest.fn(args => args)),
}));

describe('@atlaskit comments', () => {
  describe('SubtleLink', () => {
    it('should override analytics context of button', () => {
      const wrapper = mount(
        <SubtleLink analyticsContext={{ component: 'comment-action' }}>
          Like
        </SubtleLink>,
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
