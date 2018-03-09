import { handleError } from '../util/handleError';

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

export function validateMediaFile({
  id,
  name,
  size,
  creationDate,
  type,
}: MediaFile): void {
  if (!isValidFileId(id)) {
    handleError('wrong_file_id', 'Passed fileId is incorrect.');
  }

  if (!isValidName(name)) {
    handleError('wrong_file_name', 'Passed file name is incorrect.');
  }

  if (!isValidSize(size)) {
    handleError('wrong_file_size', 'Passed file size is incorrect.');
  }

  if (!isValidCreationDate(creationDate)) {
    handleError('wrong_file_date', 'Passed file creation date is incorrect.');
  }

  if (!isValidType(type)) {
    handleError('wrong_file_type', 'Passed file type is incorrect.');
  }
}

function isValidFileId(id: string): boolean {
  return typeof id === 'string' && id.length > 0;
}

function isValidName(name: string): boolean {
  return typeof name === 'string';
}

function isValidType(type: string): boolean {
  return typeof type === 'string';
}

function isValidSize(size: number): boolean {
  return typeof size === 'number' && size >= 0;
}

function isValidCreationDate(date: number): boolean {
  return typeof date === 'number' && date > 0;
}

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

export function isPublicMediaFile(file: MediaFile): file is PublicMediaFile {
  return !!(file as PublicMediaFile).publicId;
}
