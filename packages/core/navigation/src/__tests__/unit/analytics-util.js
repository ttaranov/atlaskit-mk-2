// @flow

import { navigationExpandedCollapsed } from '../../utils/analytics';

describe('Analytics Util', () => {
  const mockAnalyticsEvent = {
    fire: jest.fn(),
  };
  const mockCreateAnalyticsEvent: any = jest.fn(() => mockAnalyticsEvent);
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('navigationExpandedCollapsed', () => {
    it('should create and fire an expand event when isCollapsed is false', () => {
      navigationExpandedCollapsed(mockCreateAnalyticsEvent, {
        isCollapsed: false,
        trigger: 'chevron',
      });
      expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
      expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
        action: 'expanded',
        actionSubject: 'productNavigation',
        attributes: {
          trigger: 'chevron',
        },
      });
      expect(mockAnalyticsEvent.fire).toHaveBeenCalledTimes(1);
      expect(mockAnalyticsEvent.fire).toHaveBeenCalledWith('navigation');
    });

    it('should create and fire a collapse event when isCollapsed is true', () => {
      navigationExpandedCollapsed(mockCreateAnalyticsEvent, {
        isCollapsed: true,
        trigger: 'chevron',
      });
      expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
      expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
        action: 'collapsed',
        actionSubject: 'productNavigation',
        attributes: {
          trigger: 'chevron',
        },
      });
      expect(mockAnalyticsEvent.fire).toHaveBeenCalledTimes(1);
      expect(mockAnalyticsEvent.fire).toHaveBeenCalledWith('navigation');
    });

    ['chevron', 'resizerClick', 'resizerDrag'].forEach(trigger => {
      it(`should pass the correct trigger - ${trigger}`, () => {
        navigationExpandedCollapsed(mockCreateAnalyticsEvent, {
          isCollapsed: true,
          trigger,
        });
        expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
        expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
          action: 'collapsed',
          actionSubject: 'productNavigation',
          attributes: {
            trigger,
          },
        });
      });
    });
  });
});
