import { ImagePreview } from '../src/domain/image';

export default (file: File): Promise<ImagePreview> =>
  new Promise((resolve, reject) => {
    const img = new Image();

    img.src = URL.createObjectURL(file);
    img.onload = () =>
      resolve({ src: img.src, width: img.width, height: img.height });
    img.onerror = reject;
  });
