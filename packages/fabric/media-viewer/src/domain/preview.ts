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
export const isPreviewGenerated = (file: BackBoneModel) => {
  return {
    pipe: (cb: (isPreviewGenerated: boolean) => JQueryPromise<any>) => cb(false),
  };
}

export const generatePreview = (file: BackBoneModel) => Promise.resolve;