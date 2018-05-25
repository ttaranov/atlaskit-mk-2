import { mount } from 'enzyme';
import * as React from 'react';
import {
  doc,
  code_block,
  p,
  createEditor,
} from '@atlaskit/editor-test-helpers';
import {
  TextColorState,
  stateKey,
} from '../../../../src/plugins/text-color/pm-plugins/main';
import Color from '../../../../src/ui/ColorPalette/Color';
import ToolbarButton from '../../../../src/ui/ToolbarButton';
import ToolbarTextColor from '../../../../src/plugins/text-color/ui/ToolbarTextColor';
import textColorPlugin from '../../../../src/plugins/text-color';
import codeBlockPlugin from '../../../../src/plugins/code-block';

describe('ToolbarTextColor', () => {
  const editor = (doc: any, analyticsHandler = () => {}) =>
    createEditor<TextColorState>({
      doc,
      editorPlugins: [textColorPlugin, codeBlockPlugin()],
      editorProps: { analyticsHandler },
      pluginKey: stateKey,
    });

  describe('when plugin is enabled', () => {
    it('sets disabled to false', () => {
      const { editorView, pluginState } = editor(doc(p('text')));
      const toolbarTextColor = mount(
        <ToolbarTextColor pluginState={pluginState} editorView={editorView} />,
      );

      expect(toolbarTextColor.state('disabled')).toBe(false);
      toolbarTextColor.unmount();
    });
  });

  describe('when plugin is not enabled', () => {
    it('sets disabled to true', () => {
      const { editorView, pluginState } = editor(doc(code_block()('text')));
      const toolbarTextColor = mount(
        <ToolbarTextColor pluginState={pluginState} editorView={editorView} />,
      );

      expect(toolbarTextColor.state('disabled')).toBe(true);
      toolbarTextColor.unmount();
    });
  });

  it('should make isOpen true when toolbar textColor button is clicked', () => {
    const { pluginState, editorView } = editor(doc(p('text')));
    const toolbarTextColor = mount(
      <ToolbarTextColor pluginState={pluginState} editorView={editorView} />,
    );

    expect(toolbarTextColor.state('isOpen')).toBe(false);
    toolbarTextColor.find('button').simulate('click');
    expect(toolbarTextColor.state('isOpen')).toBe(true);
    toolbarTextColor.unmount();
  });

  it('should make isOpen false when a color is clicked', () => {
    const { pluginState, editorView } = editor(doc(p('text')));
    const toolbarTextColor = mount(
      <ToolbarTextColor pluginState={pluginState} editorView={editorView} />,
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
    const { editorView, pluginState } = editor(doc(p('text')));
    const toolbarTextColor = mount(
      <ToolbarTextColor
        disabled={true}
        pluginState={pluginState}
        editorView={editorView}
      />,
    );

    expect(toolbarTextColor.find(ToolbarButton).prop('disabled')).toBe(true);
    toolbarTextColor.unmount();
  });

  it('should have Color components as much as size of color palette', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const toolbarTextColor = mount(
      <ToolbarTextColor pluginState={pluginState} editorView={editorView} />,
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
      const { editorView, pluginState } = editor(doc(p('text')), trackEvent);
      const toolbarOption = mount(
        <ToolbarTextColor pluginState={pluginState} editorView={editorView} />,
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
