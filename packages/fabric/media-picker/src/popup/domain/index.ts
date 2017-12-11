import { Auth, AuthProvider } from '@atlaskit/media-core';

import { MediaArtifact } from '../../service/mediaApi';
import { UploadEvent } from '../../domain/uploadEvent';

export { AuthHeaders } from './auth';
export {
  SourceFile,
  SourceFileOwner,
  ClientBasedSourceFileOwner,
  AsapBasedSourceFileOwner,
} from './source-file';

export interface State {
  readonly apiUrl: string;
  readonly redirectUrl: string;
  readonly view: View;
  readonly accounts: ServiceAccountWithType[];
  readonly editorData?: EditorData;
  readonly recents: Recents;
  readonly selectedItems: SelectedItem[];
  readonly tenant: Tenant;
  readonly uploads: LocalUploads;
  readonly remoteUploads: RemoteUploads;
  readonly isCancelling: boolean;
  readonly isUploading: boolean;
  readonly userAuthProvider: AuthProvider;

  readonly lastUploadIndex: number;

  readonly onCancelUpload: CancelUploadHandler;
}

export type CancelUploadHandler = (uploadId: string) => void;

export interface Recents {
  readonly nextKey: string;
  readonly items: CollectionItem[];
}

export interface LocalUpload {
  readonly file: LocalUploadFile;
  readonly events: UploadEvent[];
  readonly tenant: Tenant;
  readonly index: number;

  progress: number | null;
  proxy?: string[];
}

export interface LocalUploadFile {
  readonly metadata: LocalUploadFileMetadata;

  dataURI: string;
}

export interface LocalUploadFileMetadata {
  readonly id: string;
  readonly mimeType: string;
  readonly name: string;
  readonly size: number;
}

export type LocalUploads = { [uploadId: string]: LocalUpload };

export type RemoteUpload = {
  readonly tenant: Tenant;
};

export type RemoteUploads = { [uploadId: string]: RemoteUpload };

export interface View {
  readonly isVisible: boolean;
  readonly items: ServiceFolderItem[];
  readonly loading: boolean;
  readonly path: Path;
  readonly service: ServiceAccountLink;
  readonly isUploading: boolean;
  readonly isCancelling: boolean;
  readonly hasPopupBeenVisible: boolean;

  readonly currentCursor?: string;
  readonly nextCursor?: string;
}

export interface EditorData {
  readonly imageUrl?: string;
  readonly originalFile?: FileReference;
  readonly error?: EditorError;
}

export interface EditorError {
  readonly message: string;
  readonly retryHandler?: () => void;
}

export interface Tenant {
  readonly auth: Auth;
  readonly uploadParams: UploadParams;
}

export interface UploadParams {
  collection?: string;
  fetchMetadata?: boolean;
  autoFinalize?: boolean;
}

export type ServiceName = 'google' | 'dropbox' | 'upload';

export type ServiceStatus =
  | 'forbidden'
  | 'scope_unsupported'
  | 'scope_insufficient'
  | 'expired'
  | 'refresh_needed'
  | 'available';

export interface Service {
  readonly type: ServiceName;
  readonly status: ServiceStatus;
  readonly accounts: ServiceAccount[];
}

export interface ServiceAccount {
  readonly email: string;
  readonly id: string;
  readonly name: string;
  readonly nickname: string;
  readonly picture: string;
  readonly status: ServiceStatus;
}

export interface ServiceAccountLink {
  readonly accountId: string;
  readonly name: ServiceName;
}

export interface ServiceAccountWithType extends ServiceAccount {
  readonly type: ServiceName;
}

export interface ServiceFolder {
  readonly mimeType: 'application/vnd.atlassian.mediapicker.folder';
  readonly id: string;
  readonly name: string;
  readonly parentId: string;
  readonly items: ServiceFolderItem[];
  readonly cursor?: string;
}

export interface ServiceFile {
  readonly mimeType: string;
  readonly id: string;
  readonly name: string;
  readonly parentId: string;
  readonly size: number;
  readonly date: number;
}

export interface SelectedItem extends ServiceFile {
  readonly serviceName: string;
  readonly accountId?: string;
}

export type ServiceFolderItem = ServiceFolder | ServiceFile;

export const isServiceFolder = (
  item: ServiceFolderItem,
): item is ServiceFolder => {
  return item.mimeType === 'application/vnd.atlassian.mediapicker.folder';
};

export const isServiceFile = (item: ServiceFolderItem): item is ServiceFile => {
  return item.mimeType !== 'application/vnd.atlassian.mediapicker.folder';
};

export interface FolderReference {
  readonly id: string;
  readonly name: string;
}

export type Path = Array<FolderReference>;

export interface FileReference {
  readonly id: string;
  readonly name: string;
}

export interface File {
  readonly id: string;
  readonly mediaType: string;
  readonly mimeType: string;
  readonly name: string;
  readonly processingStatus: string;
  readonly size: number;
  readonly artifacts: { [artifactName: string]: MediaArtifact };
}

export interface CollectionItem {
  readonly type: string;
  readonly id: string;
  readonly insertedAt: number;
  readonly occurrenceKey: string;
  readonly details: CollectionItemDetails;
}

export interface CollectionItemDetails {
  readonly name: string;
  readonly size: number;
}
