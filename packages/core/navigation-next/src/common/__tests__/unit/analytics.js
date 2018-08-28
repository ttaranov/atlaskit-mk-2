// @flow

import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { navigationItemClicked } from '../../analytics';

const mockWithAnalyticsEvents: any = withAnalyticsEvents;

const mockAnalyticsComp = jest.fn(() => () => null);

jest.mock('@atlaskit/analytics-next', () => ({
  withAnalyticsEvents: jest.fn(() => mockAnalyticsComp),
  withAnalyticsContext: jest.fn(() => jest.fn(() => () => null)),
}));

describe('analytics', () => {
  const dummyComp = () => {};
  let fireEventSpy;
  let createAnalyticsEventSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    fireEventSpy = jest.fn();
    createAnalyticsEventSpy = jest.fn(() => ({ fire: fireEventSpy }));
  });
  describe('navigationItem clicked', () => {
    it('should fire a UI event on click', () => {
      expect(mockWithAnalyticsEvents).not.toHaveBeenCalled();

      navigationItemClicked(dummyComp, 'comp');
      expect(mockWithAnalyticsEvents).toHaveBeenCalledTimes(1);
      const mockArgs = mockWithAnalyticsEvents.mock.calls[0][0];
      // Expect only onClick prop to be instrumented
      expect(Object.keys(mockArgs)).toEqual(['onClick']);

      mockArgs.onClick(createAnalyticsEventSpy, {
        icon: function myIcon() {},
        id: 'abc',
        index: 1,
      });
      // Expect event to be created with correct payload
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'clicked',
          actionSubject: 'navigationItem',
          attributes: {
            componentName: 'comp',
            iconSource: 'myIcon',
            itemId: 'abc',
            navigationItemIndex: 1,
          },
        }),
      );
      // Expect event to be fired on correct channel
      expect(fireEventSpy).toBeCalledWith('navigation');
    });

    it('should retrieve iconSource from before prop if icon prop not specified', () => {
      navigationItemClicked(dummyComp, 'comp');
      const mockArgs = mockWithAnalyticsEvents.mock.calls[0][0];
      mockArgs.onClick(createAnalyticsEventSpy, {
        before: function myBeforeIcon() {},
      });

      expect(createAnalyticsEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            iconSource: 'myBeforeIcon',
          }),
        }),
      );
    });

    it('should convert id prop from kebab case to camel case', () => {
      navigationItemClicked(dummyComp, 'comp');
      const mockArgs = mockWithAnalyticsEvents.mock.calls[0][0];
      mockArgs.onClick(createAnalyticsEventSpy, {
        id: 'my-item-id',
      });

      expect(createAnalyticsEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            itemId: 'myItemId',
          }),
        }),
      );
    });

    it('should gracefully handle missing or non-string id prop', () => {
      navigationItemClicked(dummyComp, 'comp');
      const mockArgs = mockWithAnalyticsEvents.mock.calls[0][0];
      mockArgs.onClick(createAnalyticsEventSpy, {
        id: 5,
      });

      // Numeric id
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            itemId: '5',
          }),
        }),
      );

      mockArgs.onClick(createAnalyticsEventSpy, {});

      // Undefined id
      expect(createAnalyticsEventSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            itemId: 'undefined',
          }),
        }),
      );
    });
  });
});
