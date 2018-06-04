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
  setExtensionElement,
  editExtension,
  removeExtension,
  updateExtensionLayout,
} from '../../../src/plugins/extension/actions';
import { pluginKey } from '../../../src/plugins/extension/plugin';
import extensionPlugin from '../../../src/plugins/extension';
import { findParentNodeOfType } from 'prosemirror-utils';

const macroProviderPromise = Promise.resolve(macroProvider);

describe('extension', () => {
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [extensionPlugin],
    });
  };

  const extensionAttrs = bodiedExtensionData[1].attrs;

  describe('when cursor is at the beginning of the content', () => {
    it('should create a paragraph above extension node on Enter', () => {
      const { editorView } = editor(
        doc(
          bodiedExtension(extensionAttrs)(paragraph('{<>}'), paragraph('text')),
        ),
      );

      sendKeyToPm(editorView, 'Enter');

      expect(editorView.state.doc).toEqualDocument(
        doc(paragraph(''), bodiedExtension(extensionAttrs)(paragraph('text'))),
      );
    });
  });

  describe('actions', () => {
    describe('setExtensionElement', () => {
      it('should set "element" prop in plugin state to a DOM node', () => {
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
        );
        const elementContainer = document.createElement('div');
        elementContainer.className = 'extension-container';
        const element = document.createElement('span');
        elementContainer.appendChild(element);
        document.body.appendChild(elementContainer);
        const result = setExtensionElement(element)(
          editorView.state,
          editorView.dispatch,
        );

        const pluginState = pluginKey.getState(editorView.state);
        expect(pluginState.element).toEqual(
          document.getElementsByClassName('extension-container')[0],
        );
        expect(result).toBe(true);
        document.body.removeChild(elementContainer);
      });
    });

    describe('editExtension', () => {
      it('should return false if macroProvider is not available', () => {
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
        );
        expect(editExtension(null)(editorView)).toBe(false);
      });
      it('should return false if extension node is not selected or cursor is not inside extension body', async () => {
        const { editorView } = editor(doc(paragraph('te{<>}xt')));
        const provider = await macroProviderPromise;
        expect(editExtension(provider)(editorView)).toBe(false);
      });
      it('should return true if macroProvider is available and cursor is inside extension node', async () => {
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
        );
        const provider = await macroProviderPromise;
        expect(editExtension(provider)(editorView)).toBe(true);
      });
      it('should replace selected bodiedExtension node with a new bodiedExtension node', async () => {
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs)(paragraph('{<>}'))),
        );
        const provider = await macroProviderPromise;
        editExtension(provider)(editorView);
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
        editExtension(provider)(editorView);
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
    });

    describe('removeExtension', () => {
      it('should set "element" prop in plugin state to null and remove the node', () => {
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs)(paragraph('te{<>}xt'))),
        );
        const element = document.createElement('span');
        document.body.appendChild(element);
        setExtensionElement(element)(editorView.state, editorView.dispatch);

        expect(removeExtension(editorView.state, editorView.dispatch)).toBe(
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
      const { state: { schema, selection } } = editorView;
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

      const { state: { schema } } = editorView;

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
