import VideoSnapshot from 'video-snapshot';
import { FileState, getMediaTypeFromMimeType } from '@atlaskit/media-core';
import { getOrientation } from '@atlaskit/media-ui';

export interface FilePreview {
  src?: string;
  orientation?: number;
}

export const getDataURIFromFileState = async (
  state: FileState,
): Promise<FilePreview> => {
  if (
    state.status === 'error' ||
    state.status === 'failed-processing' ||
    !state.preview
  ) {
    return {};
  }
  const type = state.preview.blob.type;
  const blob = state.preview.blob;
  const mediaType = getMediaTypeFromMimeType(type);

  if (mediaType === 'image') {
    const orientation = await getOrientation(blob as File);
    const src = URL.createObjectURL(blob);

    return {
      src,
      orientation,
    };
  }

  if (mediaType === 'video') {
    const snapshoter = new VideoSnapshot(blob);
    const src = await snapshoter.takeSnapshot();

    snapshoter.end();

    return {
      src,
    };
  }

  return {};
};
