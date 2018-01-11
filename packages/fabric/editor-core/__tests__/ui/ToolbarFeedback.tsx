import { mount } from 'enzyme';
import * as React from 'react';
import ToolbarFeedback from '../../src/ui/ToolbarFeedback';
import AkButton from '@atlaskit/button';
import { analyticsService } from '../../src/analytics';

window.jQuery = {};

describe('@atlaskit/editor-core/ui/ToolbarFeedback', () => {
  describe('analytics', () => {
    it('should trigger analyticsService.trackEvent when feedback icon is clicked', () => {
      window.jQuery = { ajax: () => {} };
      const trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
      const toolbarOption = mount(<ToolbarFeedback />);
      toolbarOption.find(AkButton).simulate('click');
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.feedback.button',
      );
      toolbarOption.unmount();
    });
  });
});
