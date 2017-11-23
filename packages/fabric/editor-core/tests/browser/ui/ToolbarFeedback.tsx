import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import EditorWidth from '../../../src/utils/editor-width';
import ToolbarButton from '../../../src/ui/ToolbarButton';
import ToolbarFeedback from '../../../src/ui/ToolbarFeedback';
import AkButton from '@atlaskit/button';
import { analyticsService } from '../../../src/analytics';

window.jQuery = {};

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

  it('should have spacing of toolbar button set to none if editorWidth is less then breakpoint6', () => {
    const toolbarOption = mount(<ToolbarFeedback editorWidth={EditorWidth.BreakPoint6 - 1} />);
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).to.equal('none');
    toolbarOption.unmount();
  });

  it('should have spacing of toolbar button set to default if editorWidth is greater then breakpoint6', () => {
    const toolbarOption = mount(<ToolbarFeedback editorWidth={EditorWidth.BreakPoint6 + 1} />);
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).to.equal('default');
    toolbarOption.unmount();
  });
});
