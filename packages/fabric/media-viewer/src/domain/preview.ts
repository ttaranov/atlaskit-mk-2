export interface BackBoneModel {
  get(id: string): any;
}

// HACK:
// This code depends heavily on MediaViewer Classic internals.
// isPreviewGenerated is only going to be called here when there is not a supported type
// passed across (that will happen when the file is not processed).
//
// We will be using this trick to handle errors.
//
// Since we are in the process of rewritting this component and deprecating MediaViewer Classic and this wrapper,
// we judged there was not much of a point on dramatically refactoring both components.
export const isPreviewGenerated = (MediaViewer: any) => (file: BackBoneModel) => {
  const deferred = MediaViewer.require('wrappers/jquery').Deferred();
  return deferred.resolve(false);
};

export const generatePreview = (MediaViewer: any) => (file: BackBoneModel) => {
  const deferred = MediaViewer.require('wrappers/jquery').Deferred();
  const isError = file.get('type') === 'error';
  return isError ? deferred.reject(new Error()) : deferred.when(file);
};