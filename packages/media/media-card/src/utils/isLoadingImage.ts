import { MediaType } from '@atlaskit/media-core';

export const isLoadingImage = (
  mediaType?: MediaType,
  dataURI?: string,
): boolean => {
  return mediaType === 'image' && !dataURI;
};
