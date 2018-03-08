// @flow
import {
  withAnalyticsEvents,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import '../src/components/SubtleLink';

jest.mock('@atlaskit/analytics-next', () => ({
  withAnalyticsEvents: jest.fn(() => jest.fn()),
  withAnalyticsContext: jest.fn(() => jest.fn()),
  createAndFireEvent: jest.fn(() => jest.fn(args => args)),
}));

describe('@atlaskit comments', () => {
  describe('SubtleLink', () => {
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
