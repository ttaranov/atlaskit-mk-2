import * as React from 'react';
import { shallow } from 'enzyme';
import MentionPicker from '../../src/ui/MentionPicker';
import { analyticsService } from '../../src/analytics';
import { MentionResource } from '../../src';

describe('MentionPicker', () => {
  describe('Analytics', () => {
    let trackEvent;
    let component;
    let componentInstance;

    const mentionProvider = Promise.resolve(
      new MentionResource({
        url: `https://url/mentions/abcde`,
        containerId: 'b0d035bd-9b98-4386-863b-07286c34dc14',
        productId: 'chat',
      }),
    );

    const pluginKey = jest.fn() as any;

    beforeEach(() => {
      trackEvent = jest.spyOn(analyticsService, 'trackEvent');

      component = shallow(
        <MentionPicker
          mentionProvider={mentionProvider}
          pluginKey={pluginKey}
        />,
      );
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
