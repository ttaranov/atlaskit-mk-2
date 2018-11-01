import { Context } from '@atlaskit/media-core';
import { UploadParams } from '@atlaskit/media-picker';

export type MediaStateStatus =
  | 'unknown'
  | 'ready'
  | 'cancelled'
  | 'preview'
  | 'error';

export interface MediaState {
  id: string;
  status?: MediaStateStatus;
  fileName?: string;
  fileSize?: number;
  fileMimeType?: string;
  dimensions?: {
    width: number | undefined;
    height: number | undefined;
  };
  scaleFactor?: number;
  fileId: Promise<string>;
  publicId?: string;
  error?: {
    name: string;
    description: string;
  };
}

export interface MediaStateManager {
  getState(id: string): MediaState | undefined;
  newState(id: string, newState: Partial<MediaState>): MediaState;
  updateState(id: string, newState: Partial<MediaState>): MediaState;
  on(id: string, cb: (state: MediaState) => void);
  off(id: string, cb: (state: MediaState) => void): void;
  destroy(): void;
}

export interface FeatureFlags {}

export interface MediaProvider {
  uploadParams?: UploadParams;

  /**
   * A manager notifying subscribers on changes in Media states
   */
  stateManager?: MediaStateManager;

  /**
   * Used for displaying Media Cards and downloading files.
   * This is context config is required.
   */
  viewContext: Promise<Context>;

  /**
   * (optional) Used for creating new uploads and finalizing files.
   * NOTE: We currently don't accept Context instance, because we need config properties
   *       to initialize
   */
  uploadContext?: Promise<Context>;

  /**
   * (optional) Used for creation of new Media links.
   */
  linkCreateContext?: Promise<Context>;

  /**
   * (optional) For any additional feature to be enabled
   */
  featureFlags?: FeatureFlags;
}

export type Listener = (data: any) => void;

export interface CustomMediaPicker {
  on(event: string, cb: Listener): void;
  removeAllListeners(event: any);
  emit(event: string, data: any): void;
  destroy(): void;
  setUploadParams(uploadParams: UploadParams);
}
