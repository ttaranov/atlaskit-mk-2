import { ServiceFile, SelectedItem } from '../domain';

export const FILE_CLICK = 'FILE_CLICK';

export interface FileClickAction {
  readonly type: 'FILE_CLICK';
  readonly file: SelectedItem;
}

export function fileClick(
  file: ServiceFile,
  serviceName: string,
  accountId?: string,
): FileClickAction {
  return {
    type: FILE_CLICK,
    file: {
      ...file,
      accountId,
      serviceName,
    },
  };
}
