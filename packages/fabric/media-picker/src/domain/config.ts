import { AuthProvider, UploadParams } from '@atlaskit/media-core';

export interface ModuleConfig {
  apiUrl: string;
  authProvider: AuthProvider;
  uploadParams?: UploadParams;
}
