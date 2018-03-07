import { shallow, mount } from 'enzyme';
import * as React from 'react';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { TableState, stateKey } from '../../src/plugins/table';
import ToolbarButton from '../../src/ui/ToolbarButton';
import TableFloatingToolbar from '../../src/ui/TableFloatingToolbar';
import { Toolbar } from '../../src/ui/TableFloatingToolbar';

import {
  doc,
  p,
  createEditor,
  table,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers';
import tablesPlugin from '../../src/editor/plugins/table';

describe('TableFloatingToolbar', () => {
  let trackEvent;
  const editor = (doc: any) =>
    createEditor<TableState>({
      doc,
      editorPlugins: [tablesPlugin],
      editorProps: {
        analyticsHandler: trackEvent,
      },
      pluginKey: stateKey,
    });

  beforeEach(() => {
    trackEvent = jest.fn();
  });

  describe('when tableElement is undefined', () => {
    it('should not render toolbar', () => {
      const { editorView } = editor(
        doc(p('text'), table(tr(tdEmpty, tdEmpty, tdEmpty))),
      );
      const floatingToolbar = shallow(
        <TableFloatingToolbar editorView={editorView} tableActive={true} />,
      );
      expect(floatingToolbar.find(Toolbar).length).toEqual(0);
    });
  });

  describe('TrashIcon', () => {
    it('should be rendered in the toolbar', () => {
      const { editorView } = editor(
        doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      const floatingToolbar = mount(
        <TableFloatingToolbar
          tableElement={document.createElement('table')}
          editorView={editorView}
          tableActive={true}
        />,
      );
      expect(floatingToolbar.find(RemoveIcon).length).toEqual(1);
      floatingToolbar.unmount();
    });

    it('should call remove() on click', () => {
      const { editorView } = editor(
        doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      const remove = jest.fn();
      const floatingToolbar = shallow(
        <TableFloatingToolbar
          tableElement={document.createElement('table')}
          editorView={editorView}
          remove={remove}
          tableActive={true}
        />,
      );

      const button = floatingToolbar.find(ToolbarButton).last();
      button.simulate('click');
      expect(remove as any).toHaveBeenCalledTimes(1);
      floatingToolbar.unmount();
    });
  });
});
