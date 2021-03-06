import { FileReference } from '../domain';

export const EDIT_REMOTE_IMAGE = 'EDIT_REMOTE_IMAGE';

export interface EditRemoteImageAction {
  readonly type: 'EDIT_REMOTE_IMAGE';
  readonly item: FileReference;
  readonly collectionName: string;
}

export function editRemoteImage(
  item: FileReference,
  collectionName: string,
): EditRemoteImageAction {
  return {
    type: EDIT_REMOTE_IMAGE,
    item,
    collectionName,
  };
}
