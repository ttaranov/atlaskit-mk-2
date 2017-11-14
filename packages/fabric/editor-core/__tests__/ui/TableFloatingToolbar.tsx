import { shallow, mount } from 'enzyme';
import * as React from 'react';
import tablePlugins, { TableState } from '../../src/plugins/table';
import tableCommands from '../../src/plugins/table/commands';
import ToolbarButton from '../../src/ui/ToolbarButton';
import TableFloatingToolbar from '../../src/ui/TableFloatingToolbar';
import { Toolbar } from '../../src/ui/TableFloatingToolbar/styles';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import { analyticsService } from '../../src/analytics';

import {
  createEvent,
  doc,
  p,
  makeEditor,
  table,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers';
import { selectRow, selectColumn } from '../../src/editor/plugins/table/actions';

describe('TableFloatingToolbar', () => {
  const event = createEvent('event');
  const editor = (doc: any) =>
    makeEditor<TableState>({
      doc,
      plugins: tablePlugins(),
    });
  let trackEvent;

  beforeEach(() => {
    trackEvent = jest.fn();
    analyticsService.trackEvent = trackEvent;
  });

  describe('when cellElement is undefined', () => {
    it('should not render toolbar', () => {
      const { editorView, pluginState } = editor(
        doc(p('text'), table(tr(tdEmpty, tdEmpty, tdEmpty))),
      );
      const floatingToolbar = shallow(
        <TableFloatingToolbar
          pluginState={pluginState}
          editorView={editorView}
        />,
      );
      expect(floatingToolbar.find(Toolbar).length).toBe(0);
    });
  });

  describe('when cellElement is defined', () => {
    it('should render toolbar', () => {
      const { editorView, pluginState } = editor(
        doc(p('text'), table(tr(tdEmpty, tdEmpty, tdEmpty))),
      );
      const floatingToolbar = shallow(
        <TableFloatingToolbar
          pluginState={pluginState}
          editorView={editorView}
        />,
      );
      floatingToolbar.setState({ cellElement: document.createElement('td') });
      expect(floatingToolbar.find(Toolbar).length).toBe(1);
    });
  });

  describe('when selecting a column inside table', () => {
    it('should render toolbar', () => {
      const { plugin, pluginState, editorView } = editor(
        doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      plugin.props.handleDOMEvents!.focus(editorView, event);
      selectColumn(0, editorView.state, editorView.dispatch);
      const floatingToolbar = mount(
        <TableFloatingToolbar
          pluginState={pluginState}
          editorView={editorView}
        />,
      );
      expect(floatingToolbar.html()).not.toBe(null);
      floatingToolbar.unmount();
    });
  });

  describe('when selecting a row inside table', () => {
    it('should render toolbar', () => {
      const { plugin, pluginState, editorView } = editor(
        doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      plugin.props.handleDOMEvents!.focus(editorView, event);
      selectRow(0, editorView.state, editorView.dispatch);
      const floatingToolbar = mount(
        <TableFloatingToolbar
          pluginState={pluginState}
          editorView={editorView}
        />,
      );
      expect(floatingToolbar.html()).not.toBe(null);
      floatingToolbar.unmount();
    });
  });

  describe('when editor is not focused', () => {
    it('should not render toolbar', () => {
      const { plugin, pluginState, editorView } = editor(
        doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      plugin.props.handleDOMEvents!.focus(editorView, event);
      selectRow(0, editorView.state, editorView.dispatch);
      const floatingToolbar = mount(
        <TableFloatingToolbar
          pluginState={pluginState}
          editorView={editorView}
        />,
      );
      expect(floatingToolbar.html()).not.toBe(null);
      plugin.props.handleDOMEvents!.blur(editorView, event);
      expect(floatingToolbar.html()).toEqual(null);
      floatingToolbar.unmount();
    });
  });

  describe('TrashIcon', () => {
    it('should be rendered in the toolbar', () => {
      const { pluginState, editorView } = editor(
        doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      const floatingToolbar = mount(
        <TableFloatingToolbar
          pluginState={pluginState}
          editorView={editorView}
        />,
      );
      floatingToolbar.setState({ cellElement: document.createElement('td') });
      const button = floatingToolbar.find(ToolbarButton).first();
      expect(button.length).toBe(1);
      expect(button.find(RemoveIcon).length).toBe(1);
      floatingToolbar.unmount();
    });

    it('should call pluginState.remove() on click', () => {
      const { pluginState, editorView } = editor(
        doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      const floatingToolbar = shallow(
        <TableFloatingToolbar
          pluginState={pluginState}
          editorView={editorView}
        />,
      );
      pluginState.remove = jest.fn();
      floatingToolbar.setState({ cellElement: document.createElement('td') });
      const button = floatingToolbar.find(ToolbarButton).first();
      button.simulate('click');
      expect(pluginState.remove as any).toHaveBeenCalledTimes(1);
      floatingToolbar.unmount();
    });
  });

  describe.skip('Advance menu', () => {
    describe('icon', () => {
      it('should be rendered in the toolbar', () => {
        const { pluginState, editorView } = editor(
          doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
        );
        const floatingToolbar = mount(
          <TableFloatingToolbar
            pluginState={pluginState}
            editorView={editorView}
          />,
        );
        floatingToolbar.setState({ cellElement: document.createElement('td') });
        const button = floatingToolbar.find(ToolbarButton).at(1);
        expect(button.find(EditorMoreIcon).length).toBe(1);
        floatingToolbar.unmount();
      });

      it('should open DropdownMenu on click', () => {
        const { pluginState, editorView } = editor(
          doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
        );
        const floatingToolbar = mount(
          <TableFloatingToolbar
            pluginState={pluginState}
            editorView={editorView}
          />,
        );
        floatingToolbar.setState({ cellElement: document.createElement('td') });
        floatingToolbar
          .find(ToolbarButton)
          .at(1)
          .simulate('click');
        expect(floatingToolbar.state('isOpen')).toBe(true);
        floatingToolbar.unmount();
      });
    });

    describe('DropdownMenu', () => {
      it('should make isOpen false when a menu item is clicked', () => {
        const { pluginState, editorView } = editor(
          doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
        );
        const floatingToolbar = mount(
          <TableFloatingToolbar
            pluginState={pluginState}
            editorView={editorView}
          />,
        );
        floatingToolbar.setState({ cellElement: document.createElement('td') });
        floatingToolbar
          .find(ToolbarButton)
          .at(1)
          .simulate('click');
        expect(floatingToolbar.state('isOpen')).toBe(true);
        floatingToolbar
          .find('DropdownMenu span[role="menuitem"]')
          .first()
          .simulate('click');
        expect(floatingToolbar.state('isOpen')).toBe(false);
        floatingToolbar.unmount();
      });

      ['cut', 'copy', 'paste'].forEach((command, i) => {
        it(`should call "${command}" command when "${
          command
        }" item is clicked`, () => {
          const { pluginState, editorView } = editor(
            doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
          );
          const floatingToolbar = mount(
            <TableFloatingToolbar
              pluginState={pluginState}
              editorView={editorView}
            />,
          );
          tableCommands[command] = jest.fn();
          floatingToolbar.setState({
            cellElement: document.createElement('td'),
          });
          floatingToolbar
            .find(ToolbarButton)
            .at(1)
            .simulate('click');
          expect(floatingToolbar.state('isOpen')).toBe(true);
          floatingToolbar
            .find('DropdownMenu span[role="menuitem"]')
            .at(i)
            .simulate('click');
          expect(pluginState[command] as any).toHaveBeenCalledTimes(1);
          floatingToolbar.unmount();
          expect(trackEvent).toHaveBeenCalledWith(
            `atlassian.editor.format.table.${command}.button`,
          );
        });
      });
    });
  });
});
