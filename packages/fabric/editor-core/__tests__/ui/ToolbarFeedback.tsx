import { mount } from 'enzyme';
import * as React from 'react';
import EditorWidth from '../../src/utils/editor-width';
import ToolbarButton from '../../src/ui/ToolbarButton';
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

  it('should have spacing of toolbar button set to none if editorWidth is less then breakpoint6', () => {
    const toolbarOption = mount(
      <ToolbarFeedback editorWidth={EditorWidth.BreakPoint6 - 1} />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toEqual('none');
    toolbarOption.unmount();
  });

  it('should have spacing of toolbar button set to default if editorWidth is greater then breakpoint6', () => {
    const toolbarOption = mount(
      <ToolbarFeedback editorWidth={EditorWidth.BreakPoint6 + 1} />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toEqual(
      'default',
    );
    toolbarOption.unmount();
  });
});
