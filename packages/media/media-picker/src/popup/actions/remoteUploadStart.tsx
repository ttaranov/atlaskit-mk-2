import { Action } from 'redux';

import { Tenant } from '../domain';

export const REMOTE_UPLOAD_START = 'REMOTE_UPLOAD_START';

export interface RemoteUploadStartAction extends Action {
  readonly type: 'REMOTE_UPLOAD_START';
  readonly uploadId: string;
  readonly tenant: Tenant;
}

export function remoteUploadStart(
  uploadId: string,
  tenant: Tenant,
): RemoteUploadStartAction {
  return {
    type: REMOTE_UPLOAD_START,
    uploadId,
    tenant,
  };
}
