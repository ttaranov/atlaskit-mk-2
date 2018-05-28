import { AuthProvider, Context } from '@atlaskit/media-core';

import { LocalUploadComponent, LocalUploadConfig } from '../localUpload';
import { MPDropzoneLoaded } from '../../outer/analytics/events';
import { MediaPickerContext } from '../../domain/context';
import { whenDomReady } from '../../util/documentReady';
import dropzoneUI from './dropzoneUI';
import { UploadEventPayloadMap } from '../..';
import { OldUploadServiceImpl } from '../../service/uploadService';

export interface DropzoneConfig extends LocalUploadConfig {
  userAuthProvider?: AuthProvider;
  container?: HTMLElement;
  headless?: boolean;
}

export interface DropzoneConstructor {
  new (
    analyticsContext: MediaPickerContext,
    context: Context,
    dropzoneConfig: DropzoneConfig,
  ): Dropzone;
}

export interface DropzoneDragEnterEventPayload {
  length: number;
}

export type DropzoneUploadEventPayloadMap = UploadEventPayloadMap & {
  readonly drop: undefined;
  readonly 'drag-enter': DropzoneDragEnterEventPayload;
  readonly 'drag-leave': undefined;
};

const toArray = (arr: any) => [].slice.call(arr, 0);

export class Dropzone extends LocalUploadComponent<
  DropzoneUploadEventPayloadMap
> {
  private container: HTMLElement;
  private instance: HTMLElement;
  private headless: boolean;
  private uiActive: boolean;

  constructor(
    analyticsContext: MediaPickerContext,
    context: Context,
    config: DropzoneConfig = { uploadParams: {} },
  ) {
    super(analyticsContext, context, config);
    const { container, headless } = config;
    this.container = container || document.body;
    this.headless = headless || false;
    this.uiActive = false;

    this.analyticsContext.trackEvent(new MPDropzoneLoaded());
  }

  public activate(): Promise<void> {
    return whenDomReady
      .then(() => {
        this.container = this.container || document.body;
        if (!this.instance) {
          return this.createInstance();
        }
      })
      .then(() => {
        this.deactivate(); // in case we call activate twice in a row
        this.container.addEventListener('dragover', this.onDragOver, false);
        this.container.addEventListener('dragleave', this.onDragLeave, false);
        this.addDropzone();
      });
  }

  private addDropzone() {
    if (this.config.useNewUploadService) {
      this.container.addEventListener('drop', this.onFileDropped);
    } else {
      (this.uploadService as OldUploadServiceImpl).addDropzone(this.container);
    }
  }

  private readonly onFileDropped = (dragEvent: DragEvent) => {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    this.onDrop(dragEvent);

    const filesArray = [].slice.call(dragEvent.dataTransfer.files);
    this.uploadService.addFiles(filesArray);
  };

  public deactivate(): void {
    this.container.removeEventListener('dragover', this.onDragOver, false);
    this.container.removeEventListener('dragleave', this.onDragLeave, false);
    this.removeDropzone();
  }

  private removeDropzone() {
    if (this.config.useNewUploadService) {
      this.container.removeEventListener('drop', this.onFileDropped);
    } else {
      (this.uploadService as OldUploadServiceImpl).removeDropzone();
    }
  }

  private onDragOver = (e: DragEvent): void => {
    e.preventDefault();

    if (this.instance && Dropzone.dragContainsFiles(e)) {
      const dataTransfer = e.dataTransfer;
      let allowed;

      try {
        allowed = dataTransfer.effectAllowed;
      } catch (e) {} // the error is expected in IE11

      dataTransfer.dropEffect =
        'move' === allowed || 'linkMove' === allowed ? 'move' : 'copy';
      this.instance.classList.add('active');
      const length = this.getDraggedItemsLength(dataTransfer);
      this.emitDragOver({ length });
    }
  };

  // Cross-browser way of getting dragged items length, we prioritize "items" if present
  // https://www.w3.org/TR/html51/editing.html#the-datatransfer-interface
  // This method is used on 'dragover' and we have no way to retrieve FileSystemFileEntry,
  // which contains info about if the dropped item is a file or directory. That info is only
  // available on 'drop'
  private getDraggedItemsLength(dataTransfer: DataTransfer): number {
    if (dataTransfer.items) {
      const items = toArray(dataTransfer.items);

      return items.filter((i: DataTransferItem) => i.kind === 'file').length;
    }

    // This is required for IE11
    return dataTransfer.files.length;
  }

  private onDragLeave = (e: DragEvent): void => {
    if (this.instance) {
      e.preventDefault();
      this.instance.classList.remove('active');
      this.emitDragLeave();
    }
  };

  private createInstance(): void {
    this.instance = this.getDropzoneUI();
    this.container.appendChild(this.instance);

    if (!this.config.useNewUploadService) {
      this.uploadService.on('file-dropped', this.onDrop);
    }
  }

  private getDropzoneUI(): HTMLElement {
    if (this.headless) {
      return document.createElement('DIV');
    } else {
      return dropzoneUI;
    }
  }

  private onDrop = (e: DragEvent): void => {
    const { instance } = this;

    if (instance && Dropzone.dragContainsFiles(e)) {
      instance.classList.remove('active');
      this.emit('drop', undefined);
      this.emitDragLeave();
    }
  };

  private emitDragOver(e: DropzoneDragEnterEventPayload): void {
    if (!this.uiActive) {
      this.uiActive = true;
      this.emit('drag-enter', e);
    }
  }

  private emitDragLeave(): void {
    if (this.uiActive) {
      this.uiActive = false;
      /*
       when drag over child elements, container will issue dragleave and then dragover immediately.
       The 50ms timeout will prevent from issuing that "false" dragleave event
       */
      window.setTimeout(() => {
        if (!this.uiActive) {
          this.emit('drag-leave', undefined);
        }
      }, 50);
    }
  }

  private static dragContainsFiles(event: DragEvent): boolean {
    const { types } = event.dataTransfer;

    return toArray(types).indexOf('Files') > -1;
  }
}
