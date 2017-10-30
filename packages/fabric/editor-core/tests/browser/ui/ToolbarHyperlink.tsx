import { expect } from 'chai';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import * as React from 'react';
import hyperlinkPlugins, { HyperlinkState } from '../../../src/plugins/hyperlink';
import ToolbarHyperlink from '../../../src/ui/ToolbarHyperlink';
import ToolbarButton from '../../../src/ui/ToolbarButton';
import AkButton from '@atlaskit/button';
import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import { doc, p, makeEditor } from '../../../src/test-helper';
import defaultSchema from '../../../src/test-helper/schema';
import { analyticsService } from '../../../src/analytics';

describe('@atlaskit/editor-core/ui/ToolbarHyperlink', () => {
  const editor = (doc: any) => makeEditor<HyperlinkState>({
    doc,
    plugins: hyperlinkPlugins(defaultSchema),
  });

  it('should trigger showLinkPanel of plugin when toolbar hyperlink button is clicked', () => {
    const { pluginState, editorView } = editor(doc(p('text')));
    const toolbarHyperlink = mount(<ToolbarHyperlink pluginState={pluginState} editorView={editorView} />);
    const spyFunc = sinon.spy();
    pluginState.showLinkPanel = spyFunc;
    toolbarHyperlink.find(LinkIcon).simulate('click');
    expect(spyFunc.callCount).to.equal(1);
    toolbarHyperlink.unmount();
  });

  it('should state variable showToolbarPanel should be true when toolbar hyperlink button is clicked without a selection', () => {
    const { pluginState, editorView } = editor(doc(p('text')));
    const toolbarHyperlink = mount(<ToolbarHyperlink pluginState={pluginState} editorView={editorView} />);
    toolbarHyperlink.find(LinkIcon).simulate('click');
    expect(pluginState.showToolbarPanel).to.equal(true);
    toolbarHyperlink.unmount();
  });

  it('should state variable showToolbarPanel should be false when toolbar hyperlink button is clicked with a selection', () => {
    const { pluginState, editorView } = editor(doc(p('text')));
    const toolbarHyperlink = mount(<ToolbarHyperlink pluginState={pluginState} editorView={editorView} />);
    toolbarHyperlink.find(ToolbarButton).simulate('click');
    expect(pluginState.showToolbarPanel).to.equal(false);
    toolbarHyperlink.unmount();
  });

  it('should render disabled ToolbarButton if disabled property is true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const toolbarTextColor = mount(
      <ToolbarHyperlink
        disabled={true}
        pluginState={pluginState}
        editorView={editorView}
      />
    );

    expect(toolbarTextColor.find(ToolbarButton).prop('disabled')).to.equal(true);
    toolbarTextColor.unmount();
  });

  describe('analytics', () => {
    it('should trigger analyticsService.trackEvent', () => {
      const trackEvent = sinon.spy();
      analyticsService.trackEvent = trackEvent;
      const { editorView, pluginState } = editor(doc(p('text')));
      const toolbarOption = mount(
        <ToolbarHyperlink
          pluginState={pluginState}
          editorView={editorView}
        />
      );
      toolbarOption.find(AkButton).simulate('click');
      expect(trackEvent.calledWith('atlassian.editor.format.hyperlink.button')).to.equal(true);
      toolbarOption.unmount();
    });
  });

});
