import { mount } from 'enzyme';
import * as React from 'react';
import AkButton from '@atlaskit/button';
import { Popup } from '@atlaskit/editor-common';
import ToolbarFeedback from '../../src/ui/ToolbarFeedback';
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

    it('should open opt out popup for bitbucket when feedback icon is clicked', () => {
      window.jQuery = { ajax: () => {} };
      const toolbarOption = mount(<ToolbarFeedback product="bitbucket" />);
      expect(toolbarOption.find(Popup).length).toEqual(0);
      toolbarOption.find(AkButton).simulate('click');
      expect(toolbarOption.find(Popup).length).toEqual(1);
      toolbarOption.unmount();
    });
  });
});
