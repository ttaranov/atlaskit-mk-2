import { AuthProvider } from '@atlaskit/media-core';

export interface UploadParams {
  collection?: string;
}

export interface ModuleConfig {
  apiUrl: string;
  authProvider: AuthProvider;
  uploadParams?: UploadParams;
}
