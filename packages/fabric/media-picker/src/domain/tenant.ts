import { Auth } from '@atlaskit/media-core';
import { UploadParams } from './config';

export interface Tenant {
  readonly auth: Auth;
  readonly uploadParams: UploadParams;
}
