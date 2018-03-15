import { AuthProvider } from '@atlaskit/media-core';

export interface UploadParams {
  collection?: string;
  fetchMetadata?: boolean;
  autoFinalize?: boolean;
}

export interface ModuleConfig {
  apiUrl: string;
  authProvider: AuthProvider;
  uploadParams?: UploadParams;
}
