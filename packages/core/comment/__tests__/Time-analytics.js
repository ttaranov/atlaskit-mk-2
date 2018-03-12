// @flow
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { name, version } from '../package.json';
import '../src/components/Time';

jest.mock('@atlaskit/analytics-next', () => ({
  withAnalyticsEvents: jest.fn(() => jest.fn()),
  withAnalyticsContext: jest.fn(() => jest.fn()),
  createAndFireEvent: jest.fn(() => jest.fn(args => args)),
}));

describe('@atlaskit comments', () => {
  describe('Time', () => {
    it('should be wrapped with analytics context', () => {
      expect(withAnalyticsContext).toHaveBeenCalledWith({
        component: 'comment-time',
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
