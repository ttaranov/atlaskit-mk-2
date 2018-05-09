export { MediaStore } from './media-store';
export { MediaFile } from './models/media';
export {
  Auth,
  ClientBasedAuth,
  isClientBasedAuth,
  AsapBasedAuth,
  isAsapBasedAuth,
  AuthContext,
  AuthProvider,
  MediaApiConfig,
  ContextConfig,
} from './models/auth';
export {
  uploadFile,
  UploadableFile,
  UploadFileCallbacks,
  UploadFileResult,
} from './uploader';

// Remove this export as soon as we deprecate oldUploadService
export { createHasher } from './utils/hashing/hasherCreator';
