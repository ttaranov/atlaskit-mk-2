import { shallow, mount } from 'enzyme';
import * as React from 'react';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import {
  doc,
  p,
  createEditor,
  table,
  tr,
  tdEmpty,
  tdCursor,
  bodiedExtension,
  bodiedExtensionData,
} from '@atlaskit/editor-test-helpers';

import {
  TablePluginState,
  stateKey,
  PermittedLayoutsDescriptor,
} from '../../../../src/plugins/table/pm-plugins/main';
import ToolbarButton from '../../../../src/ui/ToolbarButton';
import TableFloatingToolbar from '../../../../src/plugins/table/ui/TableFloatingToolbar';
import { Toolbar } from '../../../../src/plugins/table/ui/TableFloatingToolbar';
import { tablesPlugin, extensionPlugin } from '../../../../src/plugins';
describe('TableFloatingToolbar', () => {
  let trackEvent;
  const editor = (doc: any) =>
    createEditor<TablePluginState>({
      doc,
      editorPlugins: [tablesPlugin, extensionPlugin],
      editorProps: {
        analyticsHandler: trackEvent,
      },
      pluginKey: stateKey,
    });

  const editorFullPage = (doc: any) =>
    createEditor<TablePluginState>({
      doc,
      editorPlugins: [tablesPlugin, extensionPlugin],
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

  describe('when tableRef is undefined', () => {
    it('should not render toolbar', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdEmpty))),
      );
      const floatingToolbar = shallow(
        <TableFloatingToolbar editorView={editorView} pluginConfig={{}} />,
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
          tableRef={document.createElement('table')}
          editorView={editorView}
          pluginConfig={{}}
        />,
      );
      expect(floatingToolbar.find(RemoveIcon).length).toEqual(1);
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
            tableRef={document.createElement('table')}
            editorView={editorView}
            pluginConfig={{
              permittedLayouts: desc as PermittedLayoutsDescriptor,
            }}
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
          doc(
            p('text'),
            bodiedExtension(bodiedExtensionData[0].attrs)(
              table()(tr(tdCursor, tdEmpty, tdEmpty)),
            ),
          ),
        );

        const floatingToolbar = mount(
          <TableFloatingToolbar
            tableRef={document.createElement('table')}
            editorView={editorView}
            pluginConfig={{
              permittedLayouts: desc as PermittedLayoutsDescriptor,
            }}
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
          tableRef={document.createElement('table')}
          editorView={editorView}
          pluginConfig={{}}
        />,
      );

      possibleIcons.forEach(possibleIcon => {
        expect(floatingToolbar.find(possibleIcon).length).toBe(0);
      });

      floatingToolbar.unmount();
    });

    it('selects the correct layout button based on the tableLayout prop', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdCursor, tdEmpty, tdEmpty))),
      );

      const floatingToolbar = mount(
        <TableFloatingToolbar
          tableRef={document.createElement('table')}
          editorView={editorView}
          pluginConfig={{
            permittedLayouts: ['default', 'full-width'],
          }}
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
