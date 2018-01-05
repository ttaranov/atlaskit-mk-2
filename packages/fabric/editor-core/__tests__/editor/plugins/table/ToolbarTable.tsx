import { mount } from 'enzyme';
import * as React from 'react';
import { name } from '../../../../package.json';
import tablePlugins from '../../../../src/plugins/table';
import tableCommands from '../../../../src/plugins/table/commands';
import ToolbarTable from '../../../../src/ui/ToolbarTable';
import ToolbarButton from '../../../../src/ui/ToolbarButton';
import { analyticsService } from '../../../../src/analytics';
import EditorWidth from '../../../../src/utils/editor-width';

import { doc, p, makeEditor } from '@atlaskit/editor-test-helpers';
import AkButton from '@atlaskit/button';

describe(name, () => {
  const editor = (doc: any) =>
    makeEditor({
      doc,
      plugins: tablePlugins(),
    });

  describe('Plugins -> table/UI/ToolbarTable', () => {
    it('should be defined', () => {
      expect(ToolbarTable).toBeDefined();
    });

    it('should trigger analyticsService.trackEvent when table icon is clicked', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
      const toolbarOption = mount(<ToolbarTable editorView={editorView} />);
      toolbarOption.find(AkButton).simulate('click');
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.table.button',
      );
      toolbarOption.unmount();
    });

    it('should invoke tableCommands.createTable when table icon is clicked', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const trackEvent = jest.fn();
      tableCommands.createTable = () => trackEvent;
      const toolbarOption = mount(<ToolbarTable editorView={editorView} />);
      toolbarOption.find(AkButton).simulate('click');
      expect(trackEvent).toHaveBeenCalled();
      toolbarOption.unmount();
    });

    it('should invoke pluginState.subscribe when table icon is clicked', () => {
      const { editorView, pluginState } = editor(doc(p('paragraph')));
      const spy = jest.fn();
      (pluginState as any).subscribe(spy);
      const toolbarOption = mount(<ToolbarTable editorView={editorView} />);
      toolbarOption.find(AkButton).simulate('click');
      expect(spy).toHaveBeenCalled();
      toolbarOption.unmount();
    });

    it('should return null if EditorWith is less then BreakPoint3', () => {
      const { editorView } = editor(doc(p('paragraph')));
      const toolbarOption = mount(
        <ToolbarTable
          editorView={editorView}
          editorWidth={EditorWidth.BreakPoint3 - 1}
        />,
      );
      expect(toolbarOption.html()).toEqual(null);
      toolbarOption.unmount();
    });

    it('should have spacing default when EditorWidth is defined', () => {
      const { editorView } = editor(doc(p('paragraph')));
      const toolbarOption = mount(
        <ToolbarTable
          editorView={editorView}
          editorWidth={EditorWidth.BreakPoint3 + 1}
        />,
      );
      expect(toolbarOption.find(ToolbarButton).prop('spacing')).toEqual(
        'default',
      );
      toolbarOption.unmount();
    });

    it('should have disabled button if isDisbled property is passed true', () => {
      const { editorView } = editor(doc(p('paragraph')));
      const toolbarOption = mount(
        <ToolbarTable editorView={editorView} isDisabled={true} />,
      );
      expect(toolbarOption.find(ToolbarButton).prop('disabled')).toEqual(true);
      toolbarOption.unmount();
    });
  });
});
