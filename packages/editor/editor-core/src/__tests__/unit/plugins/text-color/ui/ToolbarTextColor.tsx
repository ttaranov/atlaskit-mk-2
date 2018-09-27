import * as React from 'react';
import {
  doc,
  code_block,
  p,
  createEditor,
  mountWithIntl,
} from '@atlaskit/editor-test-helpers';

import {
  TextColorPluginState,
  pluginKey,
} from '../../../../../plugins/text-color/pm-plugins/main';
import Color from '../../../../../ui/ColorPalette/Color';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import ToolbarTextColor from '../../../../../plugins/text-color/ui/ToolbarTextColor';
import textColorPlugin from '../../../../../plugins/text-color';
import codeBlockPlugin from '../../../../../plugins/code-block';

describe('ToolbarTextColor', () => {
  const editor = (doc: any, analyticsHandler = () => {}) =>
    createEditor<TextColorPluginState>({
      doc,
      editorPlugins: [textColorPlugin, codeBlockPlugin()],
      editorProps: { analyticsHandler },
      pluginKey,
    });

  describe('when plugin is enabled', () => {
    it('sets disabled to false', () => {
      const { editorView } = editor(doc(p('text')));
      const pluginState = pluginKey.getState(editorView.state);
      const toolbarTextColor = mountWithIntl(
        <ToolbarTextColor pluginState={pluginState} changeColor={() => {}} />,
      );

      expect(toolbarTextColor.prop('pluginState').disabled).toBe(false);
      toolbarTextColor.unmount();
    });
  });

  describe('when plugin is not enabled', () => {
    it('sets disabled to true', () => {
      const { editorView } = editor(doc(code_block()('text')));
      const pluginState = pluginKey.getState(editorView.state);
      const toolbarTextColor = mountWithIntl(
        <ToolbarTextColor pluginState={pluginState} changeColor={() => {}} />,
      );

      expect(toolbarTextColor.prop('pluginState').disabled).toBe(true);
      toolbarTextColor.unmount();
    });
  });

  it('should make isOpen true when toolbar textColor button is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const pluginState = pluginKey.getState(editorView.state);
    const toolbarTextColor = mountWithIntl(
      <ToolbarTextColor changeColor={() => {}} pluginState={pluginState} />,
    );

    expect(toolbarTextColor.state('isOpen')).toBe(false);
    toolbarTextColor.find('button').simulate('click');
    expect(toolbarTextColor.state('isOpen')).toBe(true);
    toolbarTextColor.unmount();
  });

  it('should make isOpen false when a color is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const pluginState = pluginKey.getState(editorView.state);
    const toolbarTextColor = mountWithIntl(
      <ToolbarTextColor changeColor={() => {}} pluginState={pluginState} />,
    );

    toolbarTextColor.find('button').simulate('click');
    expect(toolbarTextColor.state('isOpen')).toBe(true);
    toolbarTextColor
      .find('ColorPalette button')
      .first()
      .simulate('click');
    expect(toolbarTextColor.state('isOpen')).toBe(false);
    toolbarTextColor.unmount();
  });

  it('should render disabled ToolbarButton if disabled property is true', () => {
    const { editorView } = editor(doc(p('text')));
    const pluginState = pluginKey.getState(editorView.state);
    const toolbarTextColor = mountWithIntl(
      <ToolbarTextColor
        changeColor={() => {}}
        pluginState={{ ...pluginState, disabled: true }}
      />,
    );

    expect(toolbarTextColor.find(ToolbarButton).prop('disabled')).toBe(true);
    toolbarTextColor.unmount();
  });

  it('should have Color components as much as size of color palette', () => {
    const { editorView } = editor(doc(p('text')));
    const pluginState = pluginKey.getState(editorView.state);
    const toolbarTextColor = mountWithIntl(
      <ToolbarTextColor changeColor={() => {}} pluginState={pluginState} />,
    );
    toolbarTextColor.find('button').simulate('click');
    expect(toolbarTextColor.find(Color).length).toEqual(
      pluginState.palette.size,
    );
    toolbarTextColor.unmount();
  });

  describe('analytics', () => {
    it('should trigger analyticsService.trackEvent when a color is clicked', () => {
      let trackEvent = jest.fn();
      const { editorView } = editor(doc(p('text')), trackEvent);
      const pluginState = pluginKey.getState(editorView.state);
      const toolbarOption = mountWithIntl(
        <ToolbarTextColor changeColor={() => true} pluginState={pluginState} />,
      );
      toolbarOption.find('button').simulate('click');
      toolbarOption
        .find('ColorPalette button')
        .first()
        .simulate('click');
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.textcolor.button',
      );
      toolbarOption.unmount();
    });
  });
});
