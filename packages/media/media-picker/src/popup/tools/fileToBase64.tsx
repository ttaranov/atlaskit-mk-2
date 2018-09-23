export const fileToBase64 = (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    // TODO: [ts30] Add proper handling for null and ArrayBuffer
    reader.onloadend = () => resolve(reader.result as string);
    reader.onabort = () => reject('abort');
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
