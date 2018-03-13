import { ComponentClass } from 'react';

export default (): Promise<ComponentClass<any>> => {
  return import(/* webpackChunkName:"@atlaskit-internal_media-editor-view" */

  './editorView/editorView').then(module => module.EditorView);
};
