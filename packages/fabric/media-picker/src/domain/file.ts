import { handleError } from '../../util/handleError';

export interface MediaFile {
  id: string;
  name: string;
  size: number;
  creationDate: number;
  type: string;
  publicId?: string;
}

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
