import { ComponentClass } from 'react';

export default (): Promise<ComponentClass<any>> =>
  import(/* webpackChunkName:"@atlaskit-internal_media-editor-view" */

  './editorView/editorView').then(module => module.EditorView);
