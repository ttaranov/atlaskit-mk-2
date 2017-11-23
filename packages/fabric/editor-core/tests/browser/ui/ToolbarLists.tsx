import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import listsPlugins, { ListsState } from '../../../src/plugins/lists';
import EditorWidth from '../../../src/utils/editor-width';
import ToolbarButton from '../../../src/ui/ToolbarButton';
import AkButton from '@atlaskit/button';
import ToolbarLists from '../../../src/ui/ToolbarLists';
import { doc, p, makeEditor, defaultSchema } from '@atlaskit/editor-test-helpers';
import { analyticsService } from '../../../src/analytics';

describe('ToolbarLists', () => {
  const editor = (doc: any) =>
    makeEditor<ListsState>({
      doc,
      plugins: listsPlugins(defaultSchema),
    });

  it('should render disabled ToolbarButtons if disabled property is true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const toolbarLists = mount(
      <ToolbarLists disabled={true} pluginState={pluginState} editorView={editorView} />
    );

    toolbarLists.find(ToolbarButton).forEach(node => {
      expect(node.prop('disabled')).to.equal(true);
    });
    toolbarLists.unmount();
  });

  it('should have spacing of toolbar button set to none if editorWidth is less then breakpoint6', () => {
    const { pluginState, editorView } = editor(doc(p('text')));
    const toolbarOption = mount(<ToolbarLists pluginState={pluginState} editorView={editorView} editorWidth={EditorWidth.BreakPoint6 - 1} />);
    expect(toolbarOption.find(ToolbarButton).at(0).prop('spacing')).to.equal('none');
    expect(toolbarOption.find(ToolbarButton).at(1).prop('spacing')).to.equal('none');
    toolbarOption.unmount();
  });

  it('should have spacing of toolbar button set to default if editorWidth is greater then breakpoint6', () => {
    const { pluginState, editorView } = editor(doc(p('text')));
    const toolbarOption = mount(<ToolbarLists pluginState={pluginState} editorView={editorView} editorWidth={EditorWidth.BreakPoint6 + 1} />);
    expect(toolbarOption.find(ToolbarButton).at(0).prop('spacing')).to.equal('default');
    expect(toolbarOption.find(ToolbarButton).at(1).prop('spacing')).to.equal('default');
    toolbarOption.unmount();
  });


  describe('analytics', () => {
    let trackEvent;
    let toolbarOption;
    beforeEach(() => {
      const { editorView, pluginState } = editor(doc(p('text{<>}')));
      toolbarOption = mount(<ToolbarLists pluginState={pluginState} editorView={editorView} />);
      trackEvent = sinon.spy();
      analyticsService.trackEvent = trackEvent;
    });

    afterEach(() => {
      toolbarOption.unmount();
    });

    it('should trigger analyticsService.trackEvent when bulleted list button is clicked', () => {
      toolbarOption
        .find(AkButton)
        .first()
        .simulate('click');
      expect(trackEvent.calledWith('atlassian.editor.format.list.bullet.button')).to.equal(true);
    });

    it('should trigger analyticsService.trackEvent when numbered list button is clicked', () => {
      toolbarOption
        .find(AkButton)
        .at(1)
        .simulate('click');
      expect(trackEvent.calledWith('atlassian.editor.format.list.numbered.button')).to.equal(true);
    });
  });
});
