import { FileReference } from '../domain';

export const EDITOR_SHOW_IMAGE = 'EDITOR_SHOW_IMAGE';

export interface EditorShowImageAction {
  readonly type: 'EDITOR_SHOW_IMAGE';
  readonly imageUrl: string;
  readonly originalFile?: FileReference;
}

export function editorShowImage(
  imageUrl: string,
  originalFile?: FileReference,
): EditorShowImageAction {
  return {
    type: EDITOR_SHOW_IMAGE,
    imageUrl,
    originalFile,
  };
}
