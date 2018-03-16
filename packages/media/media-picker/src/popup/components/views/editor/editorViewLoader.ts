import { ComponentClass } from 'react';
import { EditorViewProps } from './editorView/editorView';

export default (): Promise<ComponentClass<EditorViewProps>> =>
  import(/* webpackChunkName:"@atlaskit-internal_media-editor-view" */

  './editorView/editorView').then(module => module.EditorView);
