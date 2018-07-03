import { mount } from 'enzyme';
import * as React from 'react';
import DropList from '@atlaskit/droplist';
import Item from '@atlaskit/item';
import { stateKey } from '../../../../../plugins/text-formatting/pm-plugins/main';
import { stateKey as clearFormattingPluginKey } from '../../../../../plugins/text-formatting/pm-plugins/clear-formatting';
import ToolbarAdvancedTextFormatting from '../../../../../plugins/text-formatting/ui/ToolbarAdvancedTextFormatting';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import {
  doc,
  p,
  panel,
  strike,
  createEditor,
} from '@atlaskit/editor-test-helpers';
import panelPlugin from '../../../../../plugins/panel';

describe('@atlaskit/editor-core/ui/ToolbarAdvancedTextFormatting', () => {
  const editor = (doc: any, trackEvent = () => {}) =>
    createEditor({
      doc,
      editorPlugins: [panelPlugin],
      pluginKey: stateKey,
      editorProps: {
        analyticsHandler: trackEvent,
      },
    });

  it('should render disabled ToolbarButton if both pluginStateTextFormatting and pluginStateClearFormatting are undefined', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarAdvancedTextFormatting editorView={editorView} />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should have spacing of toolbar button set to none if isReducedSpacing=true', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarAdvancedTextFormatting
        editorView={editorView}
        isReducedSpacing={true}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toEqual('none');
    toolbarOption.unmount();
  });

  it('should have spacing of toolbar button set to default if isReducedSpacing=false', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarAdvancedTextFormatting editorView={editorView} />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toEqual(
      'default',
    );
    toolbarOption.unmount();
  });

  it('should have only 6 child elements if both pluginStateTextFormatting and pluginStateClearFormatting are defined', () => {
    const { editorView, pluginState: textFormattingPluginState } = editor(
      doc(p('text')),
    );
    const clearFormattingPluginState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    const toolbarOption = mount(
      <ToolbarAdvancedTextFormatting
        pluginStateTextFormatting={textFormattingPluginState}
        pluginStateClearFormatting={clearFormattingPluginState}
        editorView={editorView}
      />,
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    expect(toolbarOption.find(DropList).find(Item).length).toEqual(6);
    toolbarOption.unmount();
  });

  it('should return only 5 items if only pluginStateTextFormatting is defined', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarAdvancedTextFormatting
        pluginStateTextFormatting={pluginState}
        editorView={editorView}
      />,
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    expect(toolbarOption.find(DropList).find(Item).length).toEqual(5);
    toolbarOption.unmount();
  });

  it('should return only 1 items if only pluginStateClearFormatting is defined', () => {
    const { editorView } = editor(doc(p('text')));
    const clearFormattingPluginState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    const toolbarOption = mount(
      <ToolbarAdvancedTextFormatting
        pluginStateClearFormatting={clearFormattingPluginState}
        editorView={editorView}
      />,
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    expect(toolbarOption.find(DropList).find(Item).length).toEqual(1);
    toolbarOption.unmount();
  });

  it('should render disabled toolbar button when all marks and strikethrough and clearformatting are disabled', () => {
    const { editorView, pluginState: textFormattingPluginState } = editor(
      doc(p('text')),
    );
    const clearFormattingPluginState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    if (textFormattingPluginState) {
      textFormattingPluginState.strikeDisabled = true;
      textFormattingPluginState.codeDisabled = true;
      textFormattingPluginState.underlineDisabled = true;
      textFormattingPluginState.subscriptDisabled = true;
      textFormattingPluginState.superscriptDisabled = true;
    }
    if (clearFormattingPluginState) {
      clearFormattingPluginState.formattingIsPresent = false;
    }
    const toolbarOption = mount(
      <ToolbarAdvancedTextFormatting
        pluginStateTextFormatting={textFormattingPluginState}
        pluginStateClearFormatting={clearFormattingPluginState}
        editorView={editorView}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should trigger toggleCode in pluginState when clicked', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarAdvancedTextFormatting
        pluginStateTextFormatting={pluginState}
        editorView={editorView}
      />,
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    pluginState.toggleCode = jest.fn();
    const strikeButton = toolbarOption
      .find(Item)
      .filterWhere(n => n.text() === 'Code');
    strikeButton.simulate('click');
    expect(pluginState.toggleCode).toHaveBeenCalledTimes(1);
    toolbarOption.unmount();
  });

  it('should trigger toggleStrike of pluginStateTextFormatting when strikethrough option is clicked', () => {
    const { editorView, pluginState: textFormattingPluginState } = editor(
      doc(p('text')),
    );
    const clearFormattingPluginState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    const toolbarOption = mount(
      <ToolbarAdvancedTextFormatting
        pluginStateTextFormatting={textFormattingPluginState}
        pluginStateClearFormatting={clearFormattingPluginState}
        editorView={editorView}
      />,
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    textFormattingPluginState.toggleStrike = jest.fn();
    const strikeButton = toolbarOption
      .find(Item)
      .filterWhere(n => n.text() === 'Strikethrough');
    strikeButton.simulate('click');
    expect(textFormattingPluginState.toggleStrike).toHaveBeenCalledTimes(1);
    toolbarOption.unmount();
  });

  it('should not have Strikethrough option if strikeHidden is true', () => {
    const { editorView, pluginState: textFormattingPluginState } = editor(
      doc(p('text')),
    );
    const clearFormattingPluginState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    const toolbarOption = mount(
      <ToolbarAdvancedTextFormatting
        pluginStateTextFormatting={textFormattingPluginState}
        pluginStateClearFormatting={clearFormattingPluginState}
        editorView={editorView}
      />,
    );
    toolbarOption.setState({ strikeHidden: true });
    toolbarOption.find(ToolbarButton).simulate('click');
    const strikeButton = toolbarOption.findWhere(
      wrapper => wrapper.is('span') && wrapper.text() === 'Strikethrough',
    );
    expect(strikeButton.length).toEqual(0);
    toolbarOption.unmount();
  });

  it('should trigger clearFormatting function of pluginStateTextFormatting when clearFormatting option is clicked', () => {
    const { editorView, pluginState: textFormattingPluginState } = editor(
      doc(p('text')),
    );
    const clearFormattingPluginState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    clearFormattingPluginState.formattingIsPresent = true;
    const toolbarOption = mount(
      <ToolbarAdvancedTextFormatting
        pluginStateTextFormatting={textFormattingPluginState}
        pluginStateClearFormatting={clearFormattingPluginState}
        editorView={editorView}
      />,
    );
    toolbarOption.find(ToolbarButton).simulate('click');
    clearFormattingPluginState.clearFormatting = jest.fn();
    const clearFormattingButton = toolbarOption
      .find(Item)
      .filterWhere(n => n.text() === 'Clear Formatting');
    clearFormattingButton.simulate('click');
    expect(clearFormattingPluginState.clearFormatting).toHaveBeenCalledTimes(1);
    toolbarOption.unmount();
  });

  it('should render disabled ToolbarButton if isDisabled property is true', () => {
    const { editorView, pluginState: textFormattingPluginState } = editor(
      doc(p('text')),
    );
    const clearFormattingPluginState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    const toolbarOption = mount(
      <ToolbarAdvancedTextFormatting
        pluginStateTextFormatting={textFormattingPluginState}
        pluginStateClearFormatting={clearFormattingPluginState}
        editorView={editorView}
        isDisabled
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should render disabled ToolbarButton if all marks and strikethrough and clearformatting are disabled', () => {
    const { editorView, pluginState: textFormattingPluginState } = editor(
      doc(p('text')),
    );
    const clearFormattingPluginState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    if (textFormattingPluginState) {
      textFormattingPluginState.strikeDisabled = true;
      textFormattingPluginState.codeDisabled = true;
      textFormattingPluginState.underlineDisabled = true;
      textFormattingPluginState.subscriptDisabled = true;
      textFormattingPluginState.superscriptDisabled = true;
    }
    if (clearFormattingPluginState) {
      clearFormattingPluginState.formattingIsPresent = false;
    }
    const toolbarOption = mount(
      <ToolbarAdvancedTextFormatting
        pluginStateTextFormatting={textFormattingPluginState}
        pluginStateClearFormatting={clearFormattingPluginState}
        editorView={editorView}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should be selected inside strike', () => {
    const { editorView, pluginState: textFormattingPluginState } = editor(
      doc(p(strike('text'))),
    );
    const clearFormattingPluginState = clearFormattingPluginKey.getState(
      editorView.state,
    );
    const toolbarOption = mount(
      <ToolbarAdvancedTextFormatting
        pluginStateTextFormatting={textFormattingPluginState}
        pluginStateClearFormatting={clearFormattingPluginState}
        editorView={editorView}
      />,
    );
    const toolbarButton = toolbarOption.find(ToolbarButton);
    expect(toolbarButton.prop('selected')).toBe(true);
    toolbarOption.unmount();
  });

  describe('analytics', () => {
    let trackEvent;
    let toolbarOption;
    beforeEach(() => {
      trackEvent = jest.fn();
      const { editorView, pluginState: textFormattingPluginState } = editor(
        doc(panel()(p('text'))),
        trackEvent,
      );
      const clearFormattingPluginState = clearFormattingPluginKey.getState(
        editorView.state,
      );
      toolbarOption = mount(
        <ToolbarAdvancedTextFormatting
          pluginStateTextFormatting={textFormattingPluginState}
          pluginStateClearFormatting={clearFormattingPluginState}
          editorView={editorView}
        />,
      );
      toolbarOption.find('button').simulate('click');
    });

    afterEach(() => {
      toolbarOption.unmount();
    });

    [
      { value: 'code', name: 'Code' },
      { value: 'strike', name: 'Strikethrough' },
      { value: 'subscript', name: 'Subscript' },
      { value: 'superscript', name: 'Superscript' },
      { value: 'clearFormatting', name: 'Clear Formatting' },
    ].forEach(type => {
      it(`should trigger analyticsService.trackEvent when ${
        type.name
      } is clicked`, () => {
        toolbarOption
          .find(Item)
          .filterWhere(n => n.text() === type.name)
          .simulate('click');
        expect(trackEvent).toHaveBeenCalledWith(
          `atlassian.editor.format.${type.value}.button`,
        );
      });
    });
  });
});
