import { EditorPlugin, EditorProps, EditorInstance } from '../../src/editor/types';
import { createEditor } from '../../src/editor/create-editor';
import { getDefaultPluginsList } from '../../src/editor/create-editor/create-plugins-list';
import ProviderFactory from '../../src/providerFactory';

export { EditorInstance };

export default function createEditorForTests(editorPlugins: EditorPlugin[] = [], editorProps: EditorProps = {}, providerFactory?: ProviderFactory): EditorInstance {
  const plugins = getDefaultPluginsList().concat(editorPlugins);
  const place = document.body.appendChild(document.createElement('div'));
  const editor = createEditor(
    place,
    plugins,
    editorProps,
    providerFactory ? providerFactory : new ProviderFactory()
  );

  afterEach(() => {
    editor.editorView.destroy();
    if (place && place.parentNode === document.body) {
      document.body.removeChild(place);
    }
  });

  return editor;
}
