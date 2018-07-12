import VideoSnapshot from 'video-snapshot';
import { FileState } from '@atlaskit/media-core';

export const getDataURIFromFileState = async (
  state: FileState,
): Promise<string | undefined> => {
  if (state.status === 'error' || !state.preview) {
    return undefined;
  }
  const type = state.preview.blob.type;
  const blob = state.preview.blob;

  if (type.indexOf('image/') === 0) {
    return URL.createObjectURL(blob);
  }

  if (type.indexOf('video/') === 0) {
    const snapshoter = new VideoSnapshot(blob);
    const src = await snapshoter.takeSnapshot();

    snapshoter.end();

    return src;
  }
};
