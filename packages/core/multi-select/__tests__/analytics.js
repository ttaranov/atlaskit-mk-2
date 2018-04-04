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
import '../src/components/Stateless';

// This is a global mock for this file that will mock all components wrapped with analytics
// and replace them with an empty SFC that returns null. This includes components imported
// directly in this file and others imported as dependencies of those imports.
jest.mock('@atlaskit/analytics-next', () => ({
  withAnalyticsEvents: jest.fn(() => jest.fn(() => () => null)),
  withAnalyticsContext: jest.fn(() => jest.fn(() => () => null)),
  createAndFireEvent: jest.fn(() => jest.fn(args => args)),
}));

describe('MultiSelectStateless', () => {
  it('should be wrapped with analytics context', () => {
    expect(withAnalyticsContext).toHaveBeenCalledWith({
      component: 'multi-select',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should be wrapped with analytics events', () => {
    expect(createAndFireEvent).toHaveBeenCalledWith('atlaskit');
    expect(withAnalyticsEvents).toHaveBeenCalledWith({
      onFilterChange: { action: 'filter' },
      onNewItemCreated: { action: 'createItem' },
      onSelected: { action: 'selected' },
      onRemoved: { action: 'removed' },
      onOpenChange: { action: 'toggle' },
    });
  });
});
