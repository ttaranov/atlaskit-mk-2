import { CollectionItem } from '../domain';

export const UPDATE_RECENT_FILES = 'RECENT_FILES_UPDATE';

export interface UpdateRecentFilesAction {
  readonly type: 'RECENT_FILES_UPDATE';
  readonly items: CollectionItem[];
  readonly nextKey: string;
}

export function updateRecentFiles(
  items: CollectionItem[],
  nextKey: string,
): UpdateRecentFilesAction {
  return {
    type: UPDATE_RECENT_FILES,
    items,
    nextKey,
  };
}
