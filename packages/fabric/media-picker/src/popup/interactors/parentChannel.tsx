import { UploadEvent, SelectedUploadFile } from '../../domain/uploadEvent';

export interface ParentChannel {
  ready(): void;
  hidePopup(): void;
  sendUploadEvent(
    event: UploadEvent,
    uploadId: string,
    publicId?: string,
  ): void;
  sendUploadsStartEvent(selectedUploadFiles: SelectedUploadFile[]): void;
}
