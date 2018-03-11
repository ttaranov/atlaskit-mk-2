import { Path, ServiceFolderItem } from '../domain';

export const FILE_LIST_UPDATE = 'FILE_LIST_UPDATE';

export interface FileListUpdateAction {
  readonly type: 'FILE_LIST_UPDATE';
  readonly accountId: string;
  readonly path: Path;
  readonly items: ServiceFolderItem[];

  readonly currentCursor?: string;
  readonly nextCursor?: string;
}

export function fileListUpdate(
  accountId: string,
  path: Path,
  items: ServiceFolderItem[],
  currentCursor?: string,
  nextCursor?: string,
): FileListUpdateAction {
  return {
    type: FILE_LIST_UPDATE,
    accountId,
    path,
    items,
    currentCursor,
    nextCursor,
  };
}
