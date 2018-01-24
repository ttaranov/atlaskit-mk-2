export const fileToObjectURL = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};
