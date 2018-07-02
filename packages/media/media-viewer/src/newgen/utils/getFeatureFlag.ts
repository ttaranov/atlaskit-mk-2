import { MediaViewerFeatureFlags } from '../domain';

export const featureFlagsMap = {
  nextGen: 'MediaViewerNextGenEnabled',
  customVideoPlayer: 'MediaViewerNextGenCustomVideoPlayer',
  annotationEditor: 'MediaViewerNextGenAnnotationEditor',
};

export const getFeatureFlag = (
  featureName: keyof MediaViewerFeatureFlags,
  featureFlags?: MediaViewerFeatureFlags,
): boolean => {
  if (featureFlags && featureFlags[featureName] !== undefined) {
    return Boolean(featureFlags[featureName]);
  }

  const devOverride =
    window.localStorage &&
    Boolean(window.localStorage.getItem(featureFlagsMap[featureName]));

  return devOverride;
};
