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
import '../src/components/StatelessSelect';

// This is a global mock for this file that will mock all components wrapped with analytics
// and replace them with an empty SFC that returns null. This includes components imported
// directly in this file and others imported as dependencies of those imports.
jest.mock('@atlaskit/analytics-next', () => ({
  withAnalyticsEvents: jest.fn(() => jest.fn(() => () => null)),
  withAnalyticsContext: jest.fn(() => jest.fn(() => () => null)),
  createAndFireEvent: jest.fn(() => jest.fn(args => args)),
}));

describe('SingleSelect', () => {
  it('should be wrapped with analytics context', () => {
    expect(withAnalyticsContext).toHaveBeenLastCalledWith({
      componentName: 'singleSelect',
      packageName,
      packageVersion,
    });
  });

  it('should be wrapped with analytics events', () => {
    expect(createAndFireEvent).toHaveBeenCalledWith('atlaskit');
    expect(withAnalyticsEvents).toHaveBeenLastCalledWith({
      onFilterChange: {
        action: 'filtered',
        actionSubject: 'singleSelect',
        attributes: {
          componentName: 'singleSelect',
          packageName,
          packageVersion,
        },
      },
      onSelected: {
        action: 'selected',
        actionSubject: 'singleSelect',
        attributes: {
          componentName: 'singleSelect',
          packageName,
          packageVersion,
        },
      },
      onOpenChange: {
        action: 'opened',
        actionSubject: 'singleSelect',
        attributes: {
          componentName: 'singleSelect',
          packageName,
          packageVersion,
        },
      },
    });
  });
});
