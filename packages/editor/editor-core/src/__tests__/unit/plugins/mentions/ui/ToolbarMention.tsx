import { mount } from 'enzyme';
import * as React from 'react';
import { doc, p, createEditor } from '@atlaskit/editor-test-helpers';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import { analyticsService } from '../../../../../analytics';
import mentionsPlugin from '../../../../../plugins/mentions';
import ToolbarMention from '../../../../../plugins/mentions/ui/ToolbarMention';

describe('ToolbarMention', () => {
  const editor = (doc: any, analyticsHandler = () => {}) =>
    createEditor({
      doc,
      editorPlugins: [mentionsPlugin()],
      editorProps: { analyticsHandler },
    });

  it('should create a typeAheadQuery by clicking on the ToolbarMention icon', () => {
    const { editorView } = editor(doc(p('{<>}')));
    const toolbarMention = mount(<ToolbarMention editorView={editorView} />);
    toolbarMention.find(MentionIcon).simulate('click');
    const { state } = editorView;
    expect(
      state.doc.rangeHasMark(0, 2, state.schema.marks.typeAheadQuery),
    ).toBe(true);
    toolbarMention.unmount();
  });

  describe('analytics', () => {
    it('should trigger analyticsService.trackEvent when mention icon is clicked', () => {
      const trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
      const { editorView } = editor(doc(p('')), trackEvent);
      const toolbarOption = mount(<ToolbarMention editorView={editorView} />);
      toolbarOption.find(MentionIcon).simulate('click');
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.mention.picker.trigger.button',
      );
      toolbarOption.unmount();
    });
  });
});
