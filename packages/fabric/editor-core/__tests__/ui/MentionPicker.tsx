import * as React from 'react';
import { shallow } from 'enzyme';
import MentionPicker from '../../src/ui/MentionPicker';
import { analyticsService } from '../../src/analytics';

describe('MentionPicker', () => {
  describe('Analytics', () => {
    let trackEvent;
    let component;
    let componentInstance;

    beforeEach(() => {
      trackEvent = jest.spyOn(analyticsService, 'trackEvent');

      component = shallow(<MentionPicker />);
      componentInstance = component.instance() as MentionPicker;
    });

    afterEach(() => {
      trackEvent.mockRestore();
      component.unmount();
    });

    it('should fire analytics in handleSpaceTyped', () => {
      componentInstance.handleSpaceTyped();
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.mention.picker.space',
        {},
      );
    });
  });
});
