import {
  doc,
  createEditor,
  p as paragraph,
  bodiedExtension,
  inlineExtension,
  macroProvider,
  MockMacroProvider,
  sendKeyToPm,
  inlineExtensionData,
  bodiedExtensionData,
  sleep,
  h5,
  underline,
} from '@atlaskit/editor-test-helpers';
import { NodeSelection } from 'prosemirror-state';
import {
  editExtension,
  removeExtension,
  updateExtensionLayout,
} from '../../../../plugins/extension/actions';
import { pluginKey } from '../../../../plugins/extension/plugin';
import extensionPlugin from '../../../../plugins/extension';
import { findParentNodeOfType } from 'prosemirror-utils';

const macroProviderPromise = Promise.resolve(macroProvider);

describe('extension', () => {
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [extensionPlugin],
      editorProps: {
        allowExtension: {
          allowBreakout: true,
        },
      },
    });
  };

  const extensionAttrs = bodiedExtensionData[1].attrs;

  describe('when cursor is in between two paragraphs in an extension', () => {
    it("shouldn't create a new extension node on Enter", () => {
      const { editorView } = editor(
        doc(
          bodiedExtension(extensionAttrs)(
            paragraph('paragraph 1'),
            paragraph('{<>}'),
            paragraph('paragraph 2'),
          ),
        ),
      );

      sendKeyToPm(editorView, 'Enter');

      expect(editorView.state.doc).toEqualDocument(
        doc(
          bodiedExtension(extensionAttrs)(
            paragraph('paragraph 1'),
            paragraph(''),
            paragraph('{<>}'),
            paragraph('paragraph 2'),
          ),
        ),
      );
    });
  });

  describe('actions', () => {
    describe('editExtension', () => {
      it('should return false if macroProvider is not available', () => {
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
        );
        expect(editExtension(null)(editorView.state, editorView.dispatch)).toBe(
          false,
        );
      });
      it('should return false if extension node is not selected or cursor is not inside extension body', async () => {
        const { editorView } = editor(doc(paragraph('te{<>}xt')));
        const provider = await macroProviderPromise;
        expect(
          editExtension(provider)(editorView.state, editorView.dispatch),
        ).toBe(false);
      });
      it('should return true if macroProvider is available and cursor is inside extension node', async () => {
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
        );
        const provider = await macroProviderPromise;
        expect(
          editExtension(provider)(editorView.state, editorView.dispatch),
        ).toBe(true);
      });
      it('should replace selected bodiedExtension node with a new bodiedExtension node', async () => {
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs)(paragraph('{<>}'))),
        );
        const provider = await macroProviderPromise;
        editExtension(provider)(editorView.state, editorView.dispatch);
        await sleep(0);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            bodiedExtension(bodiedExtensionData[0].attrs)(
              h5('Heading'),
              paragraph(underline('Foo')),
            ),
          ),
        );
      });
      it('should replace selected inlineExtension node with a new inlineExtension node', async () => {
        const { editorView } = editor(
          doc(
            paragraph(
              'one',
              inlineExtension(inlineExtensionData[0].attrs)(),
              'two',
            ),
          ),
        );
        editorView.dispatch(
          editorView.state.tr.setSelection(
            NodeSelection.create(editorView.state.doc, 4),
          ),
        );
        const macroProviderPromise = Promise.resolve(
          new MockMacroProvider(inlineExtensionData[1]),
        );
        const provider = await macroProviderPromise;
        editExtension(provider)(editorView.state, editorView.dispatch);
        await sleep(0);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            paragraph(
              'one',
              inlineExtension(inlineExtensionData[1].attrs)(),
              'two',
            ),
          ),
        );
      });

      describe('when nested in bodiedExtension', () => {
        it('should replace selected inlineExtension node with a new inlineExtension node', async () => {
          const { editorView } = editor(
            doc(
              bodiedExtension(extensionAttrs)(
                paragraph(
                  inlineExtension(inlineExtensionData[0].attrs)(),
                  'two',
                ),
              ),
            ),
          );
          editorView.dispatch(
            editorView.state.tr.setSelection(
              NodeSelection.create(editorView.state.doc, 2),
            ),
          );
          const macroProviderPromise = Promise.resolve(
            new MockMacroProvider(inlineExtensionData[1]),
          );
          const provider = await macroProviderPromise;
          editExtension(provider)(editorView.state, editorView.dispatch);
          await sleep(0);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              bodiedExtension(extensionAttrs)(
                paragraph(
                  inlineExtension(inlineExtensionData[1].attrs)(),
                  'two',
                ),
              ),
            ),
          );
        });
      });

      it('should preserve the extension breakout mode on edit', async () => {
        const { editorView } = editor(
          doc(
            bodiedExtension({ ...extensionAttrs, layout: 'full-width' })(
              paragraph('te{<>}xt'),
            ),
          ),
        );
        const pluginState = pluginKey.getState(editorView.state);
        const provider = await macroProviderPromise;
        expect(
          editExtension(provider)(editorView.state, editorView.dispatch),
        ).toBe(true);
        expect(pluginState.node.node.attrs.layout).toEqual('full-width');
      });
    });

    describe('removeExtension', () => {
      it('should set "element" prop in plugin state to null and remove the node', () => {
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
        );

        expect(removeExtension()(editorView.state, editorView.dispatch)).toBe(
          true,
        );

        const pluginState = pluginKey.getState(editorView.state);
        expect(pluginState.element).toEqual(null);
        expect(editorView.state.doc).toEqualDocument(doc(paragraph('')));
      });
    });
  });

  describe('show extention options', () => {
    it('should show options when the cursor is inside the extension', () => {
      const { editorView } = editor(
        doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
      );
      const pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.element).not.toEqual(null);
    });
  });

  describe('extension layouts', () => {
    it('should update the extension node layout attribute', () => {
      const { editorView } = editor(
        doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
      );
      const {
        state: { schema, selection },
      } = editorView;
      const nodeInitial = findParentNodeOfType(schema.nodes.bodiedExtension)(
        selection,
      )!.node;
      expect(nodeInitial!.attrs.layout).toBe('default');
      updateExtensionLayout('full-width')(
        editorView.state,
        editorView.dispatch,
      );

      const { node } = findParentNodeOfType(schema.nodes.bodiedExtension)(
        editorView.state.selection,
      )!;
      expect(node).toBeDefined();
      expect(node!.attrs.layout).toBe('full-width');
      editorView.destroy();
    });

    it('respects the layout attribute', () => {
      const { editorView } = editor(
        doc(
          bodiedExtension({ ...extensionAttrs, layout: 'full-width' })(
            paragraph('te{<>}xt'),
          ),
        ),
      );

      const getExtension = editorView.dom.getElementsByClassName(
        'extension-container',
      );
      expect(getExtension.length).toBe(1);
      const getExtensionElement = getExtension[0];

      expect(getExtensionElement.getAttribute('data-layout')).toBe(
        'full-width',
      );

      editorView.destroy();
    });

    it('sets the data-layout attribute on the extension DOM element', () => {
      const { editorView } = editor(
        doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
      );

      const getExtension = editorView.dom.getElementsByClassName(
        'extension-container',
      );
      expect(getExtension.length).toBe(1);
      const getExtensionElement = getExtension[0];

      expect(getExtensionElement.getAttribute('data-layout')).toBe('default');

      updateExtensionLayout('full-width')(
        editorView.state,
        editorView.dispatch,
      );
      expect(getExtensionElement.getAttribute('data-layout')).toBe(
        'full-width',
      );

      editorView.destroy();
    });

    it('sets layout attributes uniquely on extension elements', () => {
      const { editorView } = editor(
        doc(
          bodiedExtension(extensionAttrs)(paragraph('text')),
          paragraph('hello'),
          bodiedExtension(extensionAttrs)(paragraph('te{<>}xt')),
        ),
      );

      const {
        state: { schema },
      } = editorView;

      const getExtension = editorView.dom.getElementsByClassName(
        'extension-container',
      );
      expect(getExtension.length).toBe(2);
      updateExtensionLayout('full-width')(
        editorView.state,
        editorView.dispatch,
      );
      const { node } = findParentNodeOfType(schema.nodes.bodiedExtension)(
        editorView.state.selection,
      )!;
      expect(node).toBeDefined();
      expect(node!.attrs.layout).toBe('full-width');

      const getFirstExtensionElement = getExtension[0];
      const getSecondExtensionElement = getExtension[1];
      expect(getFirstExtensionElement.getAttribute('data-layout')).toBe(
        'default',
      );
      expect(getSecondExtensionElement.getAttribute('data-layout')).toBe(
        'full-width',
      );
      editorView.destroy();
    });
  });
});
