import { mount } from 'enzyme';
import * as React from 'react';
import hyperlinkPlugins, { HyperlinkState } from '../../src/plugins/hyperlink';
import ToolbarHyperlink from '../../src/ui/ToolbarHyperlink';
import ToolbarButton from '../../src/ui/ToolbarButton';
import AkButton from '@atlaskit/button';
import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import { doc, p, makeEditor, defaultSchema } from '@atlaskit/editor-test-helpers';
import { analyticsService } from '../../src/analytics';
import EditorWidth from '../../src/utils/editor-width';

describe('@atlaskit/editor-core/ui/ToolbarHyperlink', () => {
  const editor = (doc: any) => makeEditor<HyperlinkState>({
    doc,
    plugins: hyperlinkPlugins(defaultSchema),
  });

  it('should have spacing of toolbar button set to none if editorWidth is less then breakpoint6', () => {
    const { pluginState, editorView } = editor(doc(p('text')));
    const toolbarOption = mount(<ToolbarHyperlink pluginState={pluginState} editorView={editorView} editorWidth={EditorWidth.BreakPoint6 - 1} />);
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toEqual('none');
    toolbarOption.unmount();
  });

  it('should have spacing of toolbar button set to default if editorWidth is greater then breakpoint6', () => {
    const { pluginState, editorView } = editor(doc(p('text')));
    const toolbarOption = mount(<ToolbarHyperlink pluginState={pluginState} editorView={editorView} editorWidth={EditorWidth.BreakPoint6 + 1}/>);
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toEqual('default');
    toolbarOption.unmount();
  });

  it('should trigger showLinkPanel of plugin when toolbar hyperlink button is clicked', () => {
    const { pluginState, editorView } = editor(doc(p('text')));
    const toolbarHyperlink = mount(<ToolbarHyperlink pluginState={pluginState} editorView={editorView} />);
    const spyFunc = jest.fn();
    pluginState.showLinkPanel = spyFunc;
    toolbarHyperlink.find(LinkIcon).simulate('click');
    expect(spyFunc).toHaveBeenCalledTimes(1);
    toolbarHyperlink.unmount();
  });

  it('should state variable showToolbarPanel should be true when toolbar hyperlink button is clicked without a selection', () => {
    const { pluginState, editorView } = editor(doc(p('text')));
    const toolbarHyperlink = mount(<ToolbarHyperlink pluginState={pluginState} editorView={editorView} />);
    toolbarHyperlink.find(LinkIcon).simulate('click');
    expect(pluginState.showToolbarPanel).toBe(true);
    toolbarHyperlink.unmount();
  });

  it('should state variable showToolbarPanel should be false when toolbar hyperlink button is clicked with a selection', () => {
    const { pluginState, editorView } = editor(doc(p('text')));
    const toolbarHyperlink = mount(<ToolbarHyperlink pluginState={pluginState} editorView={editorView} />);
    toolbarHyperlink.find(ToolbarButton).simulate('click');
    expect(pluginState.showToolbarPanel).toBe(false);
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

    expect(toolbarTextColor.find(ToolbarButton).prop('disabled')).toBe(true);
    toolbarTextColor.unmount();
  });

  describe('analytics', () => {
    it('should trigger analyticsService.trackEvent', () => {
      const trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
      const { editorView, pluginState } = editor(doc(p('text')));
      const toolbarOption = mount(
        <ToolbarHyperlink
          pluginState={pluginState}
          editorView={editorView}
        />
      );
      toolbarOption.find(AkButton).simulate('click');
      expect(trackEvent).toHaveBeenCalledWith('atlassian.editor.format.hyperlink.button');
      toolbarOption.unmount();
    });
  });

});
