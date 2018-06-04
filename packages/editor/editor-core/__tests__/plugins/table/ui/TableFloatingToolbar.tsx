import { shallow, mount } from 'enzyme';
import * as React from 'react';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import {
  TableState,
  stateKey,
  PermittedLayoutsDescriptor,
} from '../../../../src/plugins/table/pm-plugins/main';
import ToolbarButton from '../../../../src/ui/ToolbarButton';
import TableFloatingToolbar from '../../../../src/plugins/table/ui/TableFloatingToolbar';
import { Toolbar } from '../../../../src/plugins/table/ui/TableFloatingToolbar';

import {
  doc,
  p,
  createEditor,
  table,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers';
import tablesPlugin from '../../../../src/plugins/table';

import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';

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

  const editorFullPage = (doc: any) =>
    createEditor<TableState>({
      doc,
      editorPlugins: [tablesPlugin],
      editorProps: {
        appearance: 'full-page',
        allowTables: {
          permittedLayouts: 'all',
        },
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
        doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdEmpty))),
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
        doc(p('text'), table()(tr(tdCursor, tdEmpty, tdEmpty))),
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

    it('should call removeTable() on click', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      const removeTable = jest.fn();
      const floatingToolbar = shallow(
        <TableFloatingToolbar
          tableElement={document.createElement('table')}
          editorView={editorView}
          tableActive={true}
          removeTable={removeTable}
        />,
      );

      const button = floatingToolbar.find('[title="Remove table"]').first();
      button.simulate('click');
      expect(removeTable as any).toHaveBeenCalledTimes(1);
      floatingToolbar.unmount();
    });
  });

  describe('layout options', () => {
    const possibleIcons = [FullWidthIcon, CenterIcon];

    const layoutOptions = [
      { desc: 'all', icons: [FullWidthIcon, CenterIcon] },
      { desc: ['default', 'full-width'], icons: [FullWidthIcon, CenterIcon] },
      { desc: ['default'], icons: [CenterIcon] },
      { desc: ['full-width'], icons: [FullWidthIcon] },
    ];

    layoutOptions.forEach(({ desc, icons }) => {
      it(`should display correct buttons when ${desc} are permitted layouts`, () => {
        const { editorView } = editorFullPage(
          doc(p('text'), table()(tr(tdCursor, tdEmpty, tdEmpty))),
        );

        const floatingToolbar = mount(
          <TableFloatingToolbar
            tableElement={document.createElement('table')}
            editorView={editorView}
            tableActive={true}
            permittedLayouts={desc as PermittedLayoutsDescriptor}
          />,
        );

        // ensure correct icons visible
        icons.forEach(icon => {
          expect(floatingToolbar.find(icon).length).toBe(1);
        });

        // ensure other icons are not visible
        possibleIcons.forEach(possibleIcon => {
          if (icons.indexOf(possibleIcon) === -1) {
            expect(floatingToolbar.find(possibleIcon).length).toBe(0);
          }
        });

        floatingToolbar.unmount();
      });

      it('should disable buttons when inside an unsupported layout', () => {
        const { editorView } = editorFullPage(
          doc(p('text'), table()(tr(tdCursor, tdEmpty, tdEmpty))),
        );

        const floatingToolbar = mount(
          <TableFloatingToolbar
            tableElement={document.createElement('table')}
            editorView={editorView}
            tableActive={true}
            permittedLayouts={desc as PermittedLayoutsDescriptor}
            isLayoutSupported={() => false}
          />,
        );

        icons.forEach(icon => {
          expect(
            floatingToolbar
              .find(icon)
              .closest(ToolbarButton)
              .prop('disabled'),
          ).toBe(true);
        });
      });
    });

    it('should not display buttons with no layouts', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdCursor, tdEmpty, tdEmpty))),
      );

      const floatingToolbar = mount(
        <TableFloatingToolbar
          tableElement={document.createElement('table')}
          editorView={editorView}
          tableActive={true}
        />,
      );

      possibleIcons.forEach(possibleIcon => {
        expect(floatingToolbar.find(possibleIcon).length).toBe(0);
      });

      floatingToolbar.unmount();
    });

    it('selects the correct layout button based on the tableLayout prop', () => {
      const { editorView, pluginState } = editor(
        doc(p('text'), table()(tr(tdCursor, tdEmpty, tdEmpty))),
      );

      const floatingToolbar = mount(
        <TableFloatingToolbar
          tableElement={pluginState.tableElement}
          editorView={editorView}
          tableActive={true}
          permittedLayouts={['default', 'full-width']}
          tableLayout="default"
        />,
      );

      const centerButton = floatingToolbar
        .find(CenterIcon)
        .closest(ToolbarButton);
      expect(centerButton.length).toBe(1);

      const fullWidthButton = floatingToolbar
        .find(FullWidthIcon)
        .closest(ToolbarButton);
      expect(fullWidthButton.length).toBe(1);

      expect(centerButton.props().selected).toBe(true);
      expect(fullWidthButton.props().selected).toBe(false);

      floatingToolbar.unmount();
    });
  });
});
