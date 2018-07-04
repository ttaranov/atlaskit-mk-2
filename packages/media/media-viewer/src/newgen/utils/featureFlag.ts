// @ts-ignore: unused variable
import { createContext, Context } from 'react';
import { MediaViewerFeatureFlags } from '../domain';

export const featureFlagsMap = {
  nextGen: 'MediaViewerNextGenEnabled',
  customVideoPlayer: 'MediaViewerNextGenCustomVideoPlayer',
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

export const FeatureFlagsContext = createContext<MediaViewerFeatureFlags>({
  nextGen: false,
  customVideoPlayer: false,
});
