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
    // throw new Error(`Cannot parse mimeString of dataUri: "${dataURI}"`);
    mimeString = 'unknown';
  }

  // write the bytes of the string to a typed array
  const intArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([intArray], { type: mimeString });
  return new File([blob], filename, { type: mimeString });
}

export function fileToDataURI(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      res(reader.result);
    });
    reader.addEventListener('error', rej);
    reader.readAsDataURL(file);
  });
}
