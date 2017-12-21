import { NodeSelection } from 'prosemirror-state';
import {
  doc,
  makeEditor,
  p as paragraph,
  bodiedExtension,
  macroProvider,
} from '@atlaskit/editor-test-helpers';

import {
  setExtensionElement,
  editExtension,
  removeExtension,
  selectExtension,
} from '../../../src/editor/plugins/extension/actions';
import createPlugin, {
  pluginKey,
  ExtensionState,
} from '../../../src/editor/plugins/extension/plugin';
import ProviderFactory from '../../../src/providerFactory';

const macroProviderPromise = Promise.resolve(macroProvider);

describe('extension', () => {
  const editor = (doc: any) => {
    const providerFactory = new ProviderFactory();

    return makeEditor<ExtensionState>({
      doc,
      plugins: [createPlugin(() => {}, providerFactory)],
    });
  };

  const extensionAttrs = {
    bodyType: 'rich',
    extensionType: 'com.atlassian.confluence.macro',
    extensionKey: 'expand',
  };

  describe('actions', () => {
    describe('setExtensionElement', () => {
      it('should set "element" prop in plugin state to a DOM node', () => {
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs, paragraph('te{<>}xt'))),
        );
        const element = document.createElement('span');
        document.body.appendChild(element);
        const result = setExtensionElement(element)(
          editorView.state,
          editorView.dispatch,
        );

        const pluginState = pluginKey.getState(editorView.state);
        expect(pluginState.element).toEqual(element);
        expect(result).toBe(true);
        document.body.removeChild(element);
      });
    });

    describe('editExtension', () => {
      it('should return false if macroProvider is not available', () => {
        const { editorView: { state, dispatch } } = editor(
          doc(bodiedExtension(extensionAttrs, paragraph('te{<>}xt'))),
        );
        expect(editExtension(null)(state, dispatch)).toBe(false);
      });
      it('should return false if extension node is not selected or cursor is not inside extension body', async () => {
        const { editorView: { state, dispatch } } = editor(
          doc(paragraph('te{<>}xt')),
        );
        const provider = await macroProviderPromise;
        expect(editExtension(provider)(state, dispatch)).toBe(false);
      });
      it('should return true if macroProvider is available and cursor is inside extension node', async () => {
        const { editorView: { state, dispatch } } = editor(
          doc(bodiedExtension(extensionAttrs, paragraph('te{<>}xt'))),
        );
        const provider = await macroProviderPromise;
        expect(editExtension(provider)(state, dispatch)).toBe(true);
      });
    });

    describe('removeExtension', () => {
      it('should set "element" prop in plugin state to null and remove the node', () => {
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs, paragraph('te{<>}xt'))),
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

    describe('selectExtension', () => {
      it('should create a NodeSelection and return true', () => {
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs, paragraph('te{<>}xt'))),
        );
        expect(selectExtension(editorView.state, editorView.dispatch)).toBe(
          true,
        );
        expect(editorView.state.selection instanceof NodeSelection).toEqual(
          true,
        );
      });
    });
  });
});
