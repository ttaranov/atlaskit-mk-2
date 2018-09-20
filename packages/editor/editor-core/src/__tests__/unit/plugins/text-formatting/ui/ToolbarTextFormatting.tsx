import * as React from 'react';
import AkButton from '@atlaskit/button';
import {
  doc,
  p,
  createEditor,
  mountWithIntl,
} from '@atlaskit/editor-test-helpers';
import { analyticsService } from '../../../../../analytics';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import {
  TextFormattingState,
  pluginKey,
} from '../../../../../plugins/text-formatting/pm-plugins/main';
import ToolbarTextFormatting from '../../../../../plugins/text-formatting/ui/ToolbarTextFormatting';

describe('ToolbarTextFormatting', () => {
  const editor = (doc: any) =>
    createEditor<TextFormattingState>({
      doc,
      pluginKey: pluginKey,
    });

  it('should render disabled ToolbarButtons if disabled property is true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const toolbarTextColor = mountWithIntl(
      <ToolbarTextFormatting
        disabled={true}
        textFormattingState={pluginState}
        editorView={editorView}
      />,
    );

    toolbarTextColor.find(ToolbarButton).forEach(node => {
      expect(node.prop('disabled')).toBe(true);
    });
    toolbarTextColor.unmount();
  });

  describe('analytics', () => {
    let trackEvent;
    let toolbarOption;
    beforeEach(() => {
      const { editorView, pluginState } = editor(doc(p('text')));
      toolbarOption = mountWithIntl(
        <ToolbarTextFormatting
          textFormattingState={pluginState}
          editorView={editorView}
        />,
      );
      trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
    });

    afterEach(() => {
      toolbarOption.unmount();
    });

    it('should trigger analyticsService.trackEvent when bold button is clicked', () => {
      toolbarOption
        .find(AkButton)
        .first()
        .simulate('click');
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.strong.button',
      );
    });

    it('should trigger analyticsService.trackEvent when italic button is clicked', () => {
      toolbarOption
        .find(AkButton)
        .at(1)
        .simulate('click');
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.em.button',
      );
    });
  });
});
