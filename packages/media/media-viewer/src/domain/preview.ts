import 'jquery';

export interface BackBoneModel {
  get(id: string): any;
}

// HACK:
// This code depends heavily on MediaViewer Classic internals.
// https://bitbucket.org/atlassian/mediakit-web/src/7ea6bfd4b632c7c6a2c86a54d3751890a5efd716/media-viewer/lib/core/main-view/main_view.js#main_view.js-332
// isPreviewGenerated is only going to be called here when there is not a supported type
// passed across (that will happen when the file is not processed).
//
// We will be using this trick to handle errors.
//
// Since we are in the process of rewritting this component and deprecating MediaViewer Classic and this wrapper,
// we judged there was not much of a point on dramatically refactoring both components.
export const isPreviewGenerated = (MediaViewer: any) => (): JQueryPromise<
  boolean
> => {
  const deferred: JQueryDeferred<boolean> = MediaViewer.require(
    'wrappers/jquery',
  ).Deferred();
  // this function must return a resolved deferred (deferred.resolve)
  return deferred.resolve(false);
};

export const generatePreview = (MediaViewer: any) => (
  file: BackBoneModel,
): JQueryPromise<BackBoneModel> => {
  const deferred = MediaViewer.require('wrappers/jquery').Deferred();
  const isError = file.get('type') === 'error';
  // this function must return a rejected deferred object (deferred.reject) or an unresolved one (deferred.when)
  return isError ? deferred.reject(new Error()) : deferred.when(file);
};
