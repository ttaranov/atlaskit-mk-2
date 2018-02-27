import {
  EditorProps,
  EditorInstance,
  createEditor,
  getDefaultPluginsList,
  setTextSelection,
  EventDispatcher,
} from '@atlaskit/editor-core';
import { ProviderFactory } from '@atlaskit/editor-common';
import { RefsNode, Refs } from './schema-builder';
import { Schema } from 'prosemirror-model';
import { PluginKey } from 'prosemirror-state';
import jsdomFixtures from './jsdom-fixtures';

export type Options = {
  doc?: (schema: Schema) => RefsNode;
  // It needs to be any, otherwise TypeScript complains about mismatching types when dist folder exists
  editorPlugins?: any[];
  editorProps?: EditorProps;
  providerFactory?: ProviderFactory;
  pluginKey?: PluginKey;
};

export default function createEditorForTests<T = any>({
  doc,
  editorPlugins = [],
  editorProps = {},
  providerFactory,
  pluginKey,
}: Options): EditorInstance & {
  refs: Refs;
  sel: number;
  plugin: any;
  pluginState: T;
} {
  const plugins = getDefaultPluginsList().concat(editorPlugins);
  const place = document.body.appendChild(document.createElement('div'));
  const eventDispatcher = new EventDispatcher();
  const editor = createEditor(
    place,
    plugins,
    editorProps,
    providerFactory ? providerFactory : new ProviderFactory(),
    eventDispatcher,
  );

  // Work around JSDOM/Node not supporting DOM Selection API
  if (
    !('getSelection' in window) &&
    navigator.userAgent.indexOf('Node.js') !== -1
  ) {
    jsdomFixtures(editor.editorView);
  }

  let refs;
  const { editorView } = editor;

  if (doc) {
    const defaultDoc = doc(editorView.state.schema);
    const tr = editorView.state.tr.replaceWith(
      0,
      editorView.state.doc.nodeSize - 2,
      defaultDoc.content,
    );

    tr.setMeta('addToHistory', false);
    editorView.dispatch(tr);

    refs = defaultDoc.refs;
    if (refs) {
      // Collapsed selection.
      if ('<>' in refs) {
        setTextSelection(editorView, refs['<>']);
        // Expanded selection
      } else if ('<' in refs || '>' in refs) {
        if ('<' in refs === false) {
          throw new Error('A `<` ref must complement a `>` ref.');
        }
        if ('>' in refs === false) {
          throw new Error('A `>` ref must complement a `<` ref.');
        }
        setTextSelection(editorView, refs['<'], refs['>']);
      }
    }
  }

  let plugin;
  let pluginState;

  if (pluginKey) {
    plugin = pluginKey.get(editorView.state);
    pluginState = pluginKey.getState(editorView.state);
  }

  afterEach(() => {
    editor.editorView.destroy();
    if (place && place.parentNode) {
      place.parentNode.removeChild(place);
    }
  });

  return { ...editor, refs, sel: refs ? refs['<>'] : 0, plugin, pluginState };
}
