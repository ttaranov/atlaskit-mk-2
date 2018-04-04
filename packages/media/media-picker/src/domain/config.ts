// import { Context } from '@atlaskit/media-core';

export interface UploadParams {
  collection?: string;
  fetchMetadata?: boolean;
  autoFinalize?: boolean;
}

// TODO: Does this interface makes sense now? should we remove it pass uploadParams as a different argument when needed?
// export interface ModuleConfig {
//   // apiUrl: string;
//   // authProvider: AuthProvider;
//   context: Context;
//   uploadParams?: UploadParams;
// }
