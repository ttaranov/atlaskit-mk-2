import { Auth, UploadParams } from '@atlaskit/media-core';

export interface Tenant {
  readonly auth: Auth;
  readonly uploadParams: UploadParams;
}
