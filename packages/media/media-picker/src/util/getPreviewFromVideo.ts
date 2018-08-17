import VideoSnapshot from 'video-snapshot';
import { ImagePreview } from '../domain/preview';

export const getPreviewFromVideo = (file: File): Promise<ImagePreview> =>
  new Promise(async (resolve, reject) => {
    const snapshoter = new VideoSnapshot(file);
    const src = await snapshoter.takeSnapshot();
    const img = new Image();

    img.src = src;

    img.onload = () => {
      const dimensions = { width: img.width, height: img.height };
      snapshoter.end();
      resolve({ src, dimensions } as ImagePreview);
    };

    img.onerror = reject;
  });
