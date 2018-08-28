export type MediaFile = {
  readonly id: string;
  readonly name: string;
  readonly size: number;
  readonly creationDate: number;
  readonly type: string;
};

export type PublicMediaFile = MediaFile & {
  readonly publicId: string;
};

export function copyMediaFileForUpload(
  { name, size, creationDate, type }: MediaFile,
  uploadId: string,
): MediaFile {
  // We dont' use spread here because user upload events are not sanitized
  return {
    id: uploadId,
    name,
    size,
    creationDate,
    type,
  };
}

export function copyPublicMediaFileForUpload(
  { name, size, creationDate, type, publicId }: PublicMediaFile,
  uploadId: string,
): PublicMediaFile {
  // We dont' use spread here because user upload events are not sanitized
  return {
    id: uploadId,
    name,
    size,
    creationDate,
    type,
    publicId,
  };
}
