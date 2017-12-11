export const convertBase64ToBlob = (base64: string) => {
  const sliceSize = 512;
  const base64Data = base64.split(',')[1];

  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = slice.split('').map((val, i) => slice.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: 'image/jpeg' });
};
