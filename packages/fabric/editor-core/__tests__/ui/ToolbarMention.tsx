import { mount } from 'enzyme';
import * as React from 'react';
import mentionsPlugins from '../../src/plugins/mentions';
import ToolbarMention from '../../src/ui/ToolbarMention';
import {
  doc,
  p,
  makeEditor,
  defaultSchema,
} from '@atlaskit/editor-test-helpers';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import ProviderFactory from '../../src/providerFactory';
import ToolbarButton from '../../src/ui/ToolbarButton';
import pluginKey from '../../src/plugins/mentions/plugin-key';
import { analyticsService } from '../../src/analytics';
import EditorWidth from '../../src/utils/editor-width';

describe('ToolbarMention', () => {
  const editor = (doc: any) =>
    makeEditor({
      doc,
      plugins: mentionsPlugins(defaultSchema, new ProviderFactory()),
    });

  it('should create a mentionQuery by clicking on the ToolbarMention icon', () => {
    const { editorView } = editor(doc(p('{<>}')));
    const toolbarMention = mount(
      <ToolbarMention pluginKey={pluginKey} editorView={editorView} />,
    );
    toolbarMention.find(MentionIcon).simulate('click');
    const { state } = editorView;
    expect(state.doc.rangeHasMark(0, 2, state.schema.marks.mentionQuery)).toBe(
      true,
    );
    toolbarMention.unmount();
  });

  it('should return null if EditorWidth is less then BreakPoint5', () => {
    const { editorView } = editor(doc(p('{<>}')));
    const toolbarMention = mount(
      <ToolbarMention
        pluginKey={pluginKey}
        editorView={editorView}
        editorWidth={EditorWidth.BreakPoint5 - 1}
      />,
    );
    expect(toolbarMention.html()).toEqual(null);
    toolbarMention.unmount();
  });

  it('should have spacing of ToolbarButton set to default if editorWidth is present', () => {
    const { editorView } = editor(doc(p('{<>}')));
    const toolbarMention = mount(
      <ToolbarMention
        pluginKey={pluginKey}
        editorView={editorView}
        editorWidth={EditorWidth.BreakPoint5 + 1}
      />,
    );
    expect(toolbarMention.find(ToolbarButton).prop('spacing')).toEqual(
      'default',
    );
    toolbarMention.unmount();
  });

  describe('analytics', () => {
    it('should trigger analyticsService.trackEvent when mention icon is clicked', () => {
      const trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
      const { editorView } = editor(doc(p('')));
      const toolbarOption = mount(
        <ToolbarMention pluginKey={pluginKey} editorView={editorView} />,
      );
      toolbarOption.find(MentionIcon).simulate('click');
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.mention.picker.trigger.button',
      );
      toolbarOption.unmount();
    });
  });
});
