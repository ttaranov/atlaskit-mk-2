import { ELEMENTS_CHANNEL } from '../../../constants';
import { fireAnalyticsMentionTypeaheadEvent } from '../../../util/analytics';
import {
  name as packageName,
  version as packageVersion,
} from '../../../../package.json';

describe('Util Analytics', () => {
  const createAnalyticsEventMock = jest.fn();

  it('fireAnalyticsMentionTypeaheadEvent should called with correct payload', () => {
    const eventMock = {
      fire: jest.fn(),
    };
    createAnalyticsEventMock.mockReturnValue(eventMock);
    fireAnalyticsMentionTypeaheadEvent({
      createAnalyticsEvent: createAnalyticsEventMock,
    })('someAction', 10, ['abc-123', 'abc-123', 'def-456'], 'someQuery');

    expect(createAnalyticsEventMock).toBeCalledWith({
      action: 'someAction',
      actionSubject: 'mentionTypeahead',
      attributes: {
        packageName,
        packageVersion,
        componentName: 'mention',
        duration: 10,
        query: 'someQuery',
        userIds: ['abc-123', 'abc-123', 'def-456'],
      },
      eventType: 'operational',
    });
    expect(eventMock.fire).toBeCalledWith(ELEMENTS_CHANNEL);
  });
});
