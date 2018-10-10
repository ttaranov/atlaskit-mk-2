import VideoSnapshot from 'video-snapshot';
import { FileState, getMediaTypeFromMimeType } from '@atlaskit/media-core';

export const getDataURIFromFileState = async (
  state: FileState,
): Promise<string | undefined> => {
  if (
    state.status === 'error' ||
    state.status === 'failed-processing' ||
    !state.preview
  ) {
    return undefined;
  }
  const type = state.preview.blob.type;
  const blob = state.preview.blob;
  const mediaType = getMediaTypeFromMimeType(type);

  if (mediaType === 'image') {
    return URL.createObjectURL(blob);
  }

  if (mediaType === 'video') {
    const snapshoter = new VideoSnapshot(blob);
    const src = await snapshoter.takeSnapshot();

    snapshoter.end();

    return src;
  }

  return undefined;
};
