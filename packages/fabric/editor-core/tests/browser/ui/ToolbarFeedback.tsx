import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import ToolbarFeedback from '../../../src/ui/ToolbarFeedback';
import AkButton from '@atlaskit/button';
import { analyticsService } from '../../../src/analytics';

describe('@atlaskit/editor-core/ui/ToolbarFeedback', () => {
  describe('analytics', () => {
    it('should trigger analyticsService.trackEvent when feedback icon is clicked', () => {
      window.jQuery = { ajax: () => {} };
      const trackEvent = sinon.spy();
      analyticsService.trackEvent = trackEvent;
      const toolbarOption = mount(<ToolbarFeedback />);
      toolbarOption.find(AkButton).simulate('click');
      expect(trackEvent.calledWith('atlassian.editor.feedback.button')).to.equal(true);
      toolbarOption.unmount();
    });
  });
});
