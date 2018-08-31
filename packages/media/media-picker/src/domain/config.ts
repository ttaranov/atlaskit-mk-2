export interface UploadParams {
  collection?: string;
  // This value is deprecated.
  // Use LocalUploadConfig.shouldCopyFileToRecents instead
  copyFileToRecents?: boolean;
}
