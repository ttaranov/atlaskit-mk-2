export default (): Promise<any> => {
  return import(/* webpackChunkName:"@atlaskit-internal_media-editor-view" */

  './editorView/editorView').then(module => module.EditorView);
};
