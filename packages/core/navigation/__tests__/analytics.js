// @flow
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import '../src/components/js/Navigation';

jest.mock('@atlaskit/analytics-next', () => ({
  withAnalyticsEvents: jest.fn(() => jest.fn()),
  withAnalyticsContext: jest.fn(() => jest.fn()),
  createAndFireEvent: jest.fn(() => jest.fn(args => args)),
}));

describe('Navigation', () => {
  it('should be wrapped with analytics context', () => {
    expect(withAnalyticsContext).toHaveBeenCalledWith({
      component: 'navigation',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should be wrapped with analytics events', () => {
    expect(createAndFireEvent).toHaveBeenCalledWith('atlaskit');
    expect(withAnalyticsEvents).toHaveBeenCalledWith({
      onResize: { action: 'resize' },
      onResizeStart: { action: 'resizeStart' },
      onToggleStart: { action: 'toggle' },
      onToggleEnd: { action: 'toggle' },
    });
  });
});
