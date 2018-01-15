import { EditorView } from 'prosemirror-view';
import { PluginKey } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  RefsNode,
  Refs,
} from '@atlaskit/editor-test-helpers/src/schema-builder';
import { ProseMirrorWithRefs } from '@atlaskit/editor-test-helpers/src/make-editor';
import jsdomFixtures from '@atlaskit/editor-test-helpers/src/jsdom-fixtures';

import {
  EditorPlugin,
  EditorProps,
  EditorInstance,
} from '../../src/editor/types';
import { setTextSelection } from '../../src';
import { createEditor } from '../../src/editor/create-editor';
import { getDefaultPluginsList } from '../../src/editor/create-editor/create-plugins-list';
import { EventDispatcher } from '../../src/editor/event-dispatcher';

export { EditorInstance };

export default function createEditorForTests(
  editorPlugins: EditorPlugin[] = [],
  editorProps: EditorProps = {},
  providerFactory?: ProviderFactory,
): EditorInstance {
  const plugins = getDefaultPluginsList().concat(editorPlugins);
  const place = document.body.appendChild(document.createElement('div'));
  const editor = createEditor(
    place,
    plugins,
    editorProps,
    providerFactory ? providerFactory : new ProviderFactory(),
  );

  afterEach(() => {
    editor.editorView.destroy();
    plugins.forEach((plugin: any) => plugin.destroy! && plugin.destroy());
    if (place && place.parentNode === document.body) {
      document.body.removeChild(place);
    }
  });

  return editor;
}

export interface Options {
  doc: RefsNode;
  pluginKey: PluginKey;
  plugins: EditorPlugin[];
  editorProps?: EditorProps;
  providerFactory?: ProviderFactory;
}

export interface TestEditorInstance<T> {
  editorView: EditorView;
  refs: Refs;
  sel: number;
  eventDispatcher: EventDispatcher;
  pluginState: T;
}

/**
 * Build a ProseMirror instance.
 *
 * Initial selection can be indicated using refs:
 *
 * - `<>` -- a collapsed text selection
 * - `<` and `>` -- a range text selection (`<` is from, `>` is to).
 */
export const createNewEditorForTest = <T>(
  options: Options,
): TestEditorInstance<T> => {
  const { doc, editorProps = {}, providerFactory } = options;
  const plugins = getDefaultPluginsList().concat(options.plugins);

  editorProps.defaultValue = doc;

  const place = document.body.appendChild(document.createElement('div'));
  const editor = createEditor(
    place,
    plugins,
    editorProps,
    providerFactory ? providerFactory : new ProviderFactory(),
  );

  const { editorView, eventDispatcher } = editor;
  const pluginState = options.pluginKey.getState(editorView.state) as T;

  // Work around JSDOM/Node not supporting DOM Selection API
  if (
    !('getSelection' in window) &&
    navigator.userAgent.indexOf('Node.js') !== -1
  ) {
    jsdomFixtures(editorView);
  }

  const { refs } = (editorView.state as ProseMirrorWithRefs).doc;

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

  afterEach(() => {
    editorView.destroy();
    plugins.forEach((plugin: any) => plugin.destroy! && plugin.destroy());
    if (place && place.parentNode) {
      place.parentNode.removeChild(place);
    }
  });

  return {
    editorView,
    refs,
    sel: refs['<>'],
    eventDispatcher,
    pluginState,
  };
};
