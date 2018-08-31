const maxEmojiSizeInBytes = 1048576;

export const getNaturalImageSize = (
  dataURL: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    });
    img.addEventListener('error', reject);
    img.src = dataURL;
  });
};

export const parseImage = (dataURL: string): Promise<{ src: string }> => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve({ src: img.src });
    img.onerror = () => reject();
    img.src = dataURL;
  });
};

export const hasFileExceededSize = (file: File): boolean => {
  return file && file.size > maxEmojiSizeInBytes;
};
