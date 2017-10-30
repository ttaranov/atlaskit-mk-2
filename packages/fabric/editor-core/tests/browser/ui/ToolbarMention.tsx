import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import mentionsPlugins from '../../../src/plugins/mentions';
import ToolbarMention from '../../../src/ui/ToolbarMention';
import { doc, p, makeEditor } from '../../../src/test-helper';
import defaultSchema from '../../../src/test-helper/schema';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import ProviderFactory from '../../../src/providerFactory';
import pluginKey from '../../../src/plugins/mentions/plugin-key';
import { analyticsService } from '../../../src/analytics';

describe('ToolbarMention', () => {
  const editor = (doc: any) => makeEditor({
    doc,
    plugins: mentionsPlugins(defaultSchema, new ProviderFactory()),
  });

  it('should create a mentionQuery by clicking on the ToolbarMention icon', () => {
    const { editorView } = editor(doc(p('{<>}')));
    const toolbarMention = mount(<ToolbarMention pluginKey={pluginKey} editorView={editorView} />);
    toolbarMention.find(MentionIcon).simulate('click');
    const { state } = editorView;
    expect(state.doc.rangeHasMark(0, 2, state.schema.marks.mentionQuery)).to.equal(true);
    toolbarMention.unmount();
  });

  describe('analytics', () => {
    it('should trigger analyticsService.trackEvent when mention icon is clicked', () => {
      const trackEvent = sinon.spy();
      analyticsService.trackEvent = trackEvent;
      const { editorView } = editor(doc(p('')));
      const toolbarOption = mount(<ToolbarMention pluginKey={pluginKey} editorView={editorView} />);
      toolbarOption.find(MentionIcon).simulate('click');
      expect(trackEvent.calledWith('atlassian.editor.mention.button')).to.equal(true);
      toolbarOption.unmount();
    });
  });
});
