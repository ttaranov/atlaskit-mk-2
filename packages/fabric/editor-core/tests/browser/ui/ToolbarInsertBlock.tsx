import { expect } from 'chai';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import * as React from 'react';
import blockTypePlugins from '../../../src/plugins/block-type';
import tablePlugins from '../../../src/plugins/table';
import tableCommands from '../../../src/plugins/table/commands';
import mediaPlugins from '../../../src/plugins/media';
import DropdownMenu from '@atlaskit/dropdown-menu';
import ToolbarInsertBlock from '../../../src/ui/ToolbarInsertBlock';
import AkButton from '@atlaskit/button';
import { doc, p, makeEditor, code_block } from '../../../src/test-helper';
import defaultSchema from '../../../src/test-helper/schema';
import ToolbarButton from '../../../src/ui/ToolbarButton';
import { MediaProvider } from '@atlaskit/media-core';
import ProviderFactory from '../../../src/providerFactory';
import { analyticsService } from '../../../src/analytics';

const mediaProvider: Promise<MediaProvider> = Promise.resolve({
  viewContext: Promise.resolve({}),
  uploadContext: Promise.resolve({})
});

const providerFactory = new ProviderFactory();
providerFactory.setProvider('mediaProvider', mediaProvider);

describe('@atlaskit/editor-core/ui/ToolbarInsertBlock', () => {
  const blockTypePluginsSet = blockTypePlugins(defaultSchema);
  const tablePluginsSet = tablePlugins();
  const mediaPluginsSet = mediaPlugins(defaultSchema, { providerFactory });
  const editor = (doc: any) => makeEditor({
    doc,
    plugins: [...blockTypePluginsSet, ...tablePluginsSet, ...mediaPluginsSet],
  });
  let trackEvent;
  beforeEach(() => {
    trackEvent = sinon.spy();
    analyticsService.trackEvent = trackEvent;
  });

  it('should render disabled ToolbarButton if isDisabled property is true', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarInsertBlock
        tableHidden={false}
        editorView={editorView}
        isDisabled={true}
      />
    );
    expect(toolbarOption.find(AkButton).prop('isDisabled')).to.equal(true);
    toolbarOption.unmount();
  });

  it('should not render disabled ToolbarButton even if current selection is code block', () => {
    const { editorView } = editor(doc(code_block()('text{<>}')));
    const toolbarOption = mount(
      <ToolbarInsertBlock
        tableHidden={false}
        editorView={editorView}
      />
    );
    expect(toolbarOption.find(AkButton).prop('isDisabled')).to.equal(false);
    toolbarOption.unmount();
  });

  it('should not render if none of the plugins are present', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarInsertBlock
        editorView={editorView}
      />
    );
    expect(toolbarOption.html()).to.equal(null);
    toolbarOption.unmount();
  });

  it('should have 3 child elements if pluginStateBlockType.availableWrapperBlockTypes is defined', () => {
    const { editorView } = editor(doc(p('text')));
    const pluginStateBlockType = blockTypePluginsSet[0].getState(editorView.state);
    const toolbarOption = mount(
      <ToolbarInsertBlock
        availableWrapperBlockTypes={pluginStateBlockType.availableWrapperBlockTypes}
        editorView={editorView}
      />
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    expect(toolbarOption.find(DropdownMenu).prop('items')[0]['items'].length).to.equal(3);
    toolbarOption.unmount();
  });

  it('should have 1 child elements if tableHidden is defined and equals false', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarInsertBlock
        tableHidden={false}
        editorView={editorView}
      />
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    expect(toolbarOption.find(DropdownMenu).prop('items')[0]['items'].length).to.equal(1);
    toolbarOption.unmount();
  });

  it('should have 1 child elements if mediaUploadsEnabled is defined and equals true', async () => {
    const { editorView } = editor(doc(p('text')));

    const media = await mediaProvider;
    await media.uploadContext;

    const toolbarOption = mount(
      <ToolbarInsertBlock
        mediaUploadsEnabled={true}
        editorView={editorView}
      />
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    expect(toolbarOption.find(DropdownMenu).prop('items')[0]['items'].length).to.equal(1);
    toolbarOption.unmount();
  });

  it('should trigger showMediaPicker of pluginStateMedia when File and Images option is clicked', async () => {
    const { editorView } = editor(doc(p('text')));

    const media = await mediaProvider;
    await media.uploadContext;

    mediaPluginsSet[0].getState(editorView.state).showMediaPicker = sinon.spy();

    const toolbarOption = mount(
      <ToolbarInsertBlock
        mediaUploadsEnabled={true}
        onShowMediaPicker={mediaPluginsSet[0].getState(editorView.state).showMediaPicker}
        editorView={editorView}
      />
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    const mediaButton = toolbarOption
      .find('Item')
      .filterWhere(n => n.text().indexOf('Files and images') > 0)
      .find('Element');
    mediaButton.simulate('click');
    expect(mediaPluginsSet[0].getState(editorView.state).showMediaPicker.callCount).to.equal(1);
    expect(trackEvent.calledWith('atlassian.editor.format.media.button')).to.equal(true);
    toolbarOption.unmount();
  });

  it('should trigger insertBlockType when Panel option is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const pluginStateBlockType = blockTypePluginsSet[0].getState(editorView.state);
    pluginStateBlockType.insertBlockType = sinon.spy();

    const toolbarOption = mount(
      <ToolbarInsertBlock
        availableWrapperBlockTypes={pluginStateBlockType.availableWrapperBlockTypes}
        onInsertBlockType={pluginStateBlockType.insertBlockType}
        editorView={editorView}
      />
    );
    toolbarOption.find(ToolbarButton).simulate('click');

    const panelButton = toolbarOption
      .find('Item')
      .filterWhere(n => n.text().indexOf('Panel') > 0)
      .find('Element');
    panelButton.simulate('click');
    expect(blockTypePluginsSet[0].getState(editorView.state).insertBlockType.callCount).to.equal(1);
    expect(trackEvent.calledWith('atlassian.editor.format.panel.button')).to.equal(true);
    toolbarOption.unmount();
  });

  it('should trigger insertBlockType when code block option is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const pluginStateBlockType = blockTypePluginsSet[0].getState(editorView.state);
    pluginStateBlockType.insertBlockType = sinon.spy();

    const toolbarOption = mount(
      <ToolbarInsertBlock
        availableWrapperBlockTypes={pluginStateBlockType.availableWrapperBlockTypes}
        onInsertBlockType={pluginStateBlockType.insertBlockType}
        editorView={editorView}
      />
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    const codeblockButton = toolbarOption
      .find('Item')
      .filterWhere(n => n.text().indexOf('Code block') > 0)
      .find('Element');
    codeblockButton.simulate('click');
    expect(pluginStateBlockType.insertBlockType.callCount).to.equal(1);
    expect(trackEvent.calledWith('atlassian.editor.format.codeblock.button')).to.equal(true);
    toolbarOption.unmount();
  });

  it('should trigger insertBlockType when blockquote option is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const pluginStateBlockType = blockTypePluginsSet[0].getState(editorView.state);
    pluginStateBlockType.insertBlockType = sinon.spy();

    const toolbarOption = mount(
      <ToolbarInsertBlock
        availableWrapperBlockTypes={pluginStateBlockType.availableWrapperBlockTypes}
        onInsertBlockType={pluginStateBlockType.insertBlockType}
        editorView={editorView}
      />
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    const blockquoteButton = toolbarOption
      .find('Item')
      .filterWhere(n => n.text().indexOf('Block quote') > 0)
      .find('Element');
    blockquoteButton.simulate('click');
    expect(pluginStateBlockType.insertBlockType.callCount).to.equal(1);
    expect(trackEvent.calledWith('atlassian.editor.format.blockquote.button')).to.equal(true);
    toolbarOption.unmount();
  });

  it('should track table creation event when table menu is clicked option is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarInsertBlock
        tableHidden={false}
        editorView={editorView}
      />
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    const funcSpy = sinon.spy();
    tableCommands.createTable = () => funcSpy;
    const tableButton = toolbarOption
      .find('Item')
      .filterWhere(n => n.text().indexOf('Table') > 0)
      .find('Element');
    tableButton.simulate('click');
    expect(funcSpy.callCount).to.equal(1);
    expect(trackEvent.calledWith('atlassian.editor.format.table.button')).to.equal(true);
    toolbarOption.unmount();
  });

  it('should trigger insertMacroFromMacroBrowser when "[...] View More" option is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const insertMacroFromMacroBrowser = sinon.spy();
    const macroProvider = {} as any;

    const toolbarOption = mount(
      <ToolbarInsertBlock
        macroProvider={macroProvider}
        onInsertMacroFromMacroBrowser={insertMacroFromMacroBrowser}
        editorView={editorView}
      />
    );

    toolbarOption.find(ToolbarButton).simulate('click');
    const button = toolbarOption
      .find('Item')
      .filterWhere(n => n.text().indexOf('View more') > -1)
      .find('Element');
    button.simulate('click');
    expect(insertMacroFromMacroBrowser.callCount).to.equal(1);
    expect(trackEvent.calledWith('atlassian.editor.format.macro.button')).to.equal(true);
    toolbarOption.unmount();
  });
});
