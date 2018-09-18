export function dataURItoFile(
  dataURI: string,
  filename: string = 'untitled',
): File {
  if (dataURI.length === 0) {
    throw new Error('dataURI not found');
  }

  // convert base64/URLEncoded data component to raw binary data held in a string
  const byteString =
    dataURI.split(',')[0].indexOf('base64') >= 0
      ? atob(dataURI.split(',')[1])
      : decodeURIComponent(dataURI.split(',')[1]);

  // separate out the mime component
  let mimeString;
  try {
    mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
  } catch (e) {
    mimeString = 'unknown';
  }

  // write the bytes of the string to a typed array
  const intArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([intArray], { type: mimeString });
  try {
    return new File([blob], filename, { type: mimeString });
  } catch (e) {
    return blob as File;
  }
}

export function fileToDataURI(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      // TODO: [ts30] Add proper handling for null and ArrayBuffer
      resolve(reader.result as string);
    });
    reader.addEventListener('error', reject);
    reader.readAsDataURL(blob);
  });
}

// store first base64 calc dataURI with File, return cached value to optimise performance
interface CachedBlob extends Blob {
  __base64Src: string;
}

export const fileToDataURICached = async (blob: Blob): Promise<string> => {
  const cachedBlob = blob as CachedBlob;
  if (cachedBlob.__base64Src) {
    return cachedBlob.__base64Src;
  }
  const base64Str = await fileToDataURI(blob);
  cachedBlob.__base64Src = base64Str;
  return base64Str;
};
