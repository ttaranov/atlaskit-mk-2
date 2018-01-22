export const isPreviewGenerated = () => {
    return {
      // HACK: this code depends heavily on MediaViewer Classic internals.
      // isPreviewGenerated is only going to be called here when there is not a supported type
      // passed (that will happen when the file is not processed),
      // so we can just return "false" here instead of "file.processed".
      // Since we are in the process of rewritting this component and deprecating MediaViewer Classic and this wrapper,
      // we judged there was not much of a point on dramatically refactoring both components.;p
      pipe: (cb: (isPreviewGenerated: boolean) => Promise<any>) => cb(false)
    };
  }

export const generatePreview = Promise.resolve;