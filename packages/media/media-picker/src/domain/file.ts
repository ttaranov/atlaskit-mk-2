export type MediaFile = {
  readonly id: string;
  readonly upfrontId: Promise<string>;
  readonly userUpfrontId?: Promise<string>;
  readonly userOccurrenceKey?: Promise<string>;
  readonly name: string;
  readonly size: number;
  readonly creationDate: number;
  readonly type: string;
  readonly occurrenceKey?: string;
};

export type PublicMediaFile = MediaFile & {
  readonly publicId: string;
};

export function copyMediaFileForUpload(
  {
    name,
    size,
    creationDate,
    type,
    upfrontId,
    userUpfrontId,
    occurrenceKey,
  }: MediaFile,
  uploadId: string,
): MediaFile {
  // We dont' use spread here because user upload events are not sanitized
  return {
    id: uploadId,
    name,
    size,
    creationDate,
    type,
    upfrontId,
    userUpfrontId,
    occurrenceKey,
  };
}

export function copyPublicMediaFileForUpload(
  {
    name,
    size,
    creationDate,
    type,
    publicId,
    upfrontId,
    userUpfrontId,
    occurrenceKey,
  }: PublicMediaFile,
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
    upfrontId,
    userUpfrontId,
    occurrenceKey,
  };
}
