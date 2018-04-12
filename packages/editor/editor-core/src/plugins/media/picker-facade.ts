import {
  MediaPicker,
  MediaPickerComponent,
  MediaPickerComponents,
  ComponentConfigs,
  Popup,
  Browser,
  Dropzone,
  Clipboard,
  BinaryUploader,
  UploadsStartEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadStatusUpdateEventPayload,
  UploadProcessingEventPayload,
  UploadFinalizeReadyEventPayload,
  UploadErrorEventPayload,
  UploadEndEventPayload,
  MediaFile,
  UploadParams,
} from '@atlaskit/media-picker';
import { Context } from '@atlaskit/media-core';

import { ErrorReportingHandler, isImage } from '../../utils';
import { appendTimestamp } from './utils/media-common';
import { MediaStateManager, MediaState, MediaStateStatus } from './types';

export type PickerType = keyof MediaPickerComponents;
export type PickerFacadeConfig = {
  context: Context;
  stateManager: MediaStateManager;
  errorReporter: ErrorReportingHandler;
};

export default class PickerFacade {
  private picker: MediaPickerComponent;
  private onStartListeners: Array<(states: MediaState[]) => void> = [];
  private onDragListeners: Array<Function> = [];
  private errorReporter: ErrorReportingHandler;
  private pickerType: PickerType;
  private stateManager: MediaStateManager;

  constructor(
    pickerType: PickerType,
    config: PickerFacadeConfig,
    pickerConfig?: ComponentConfigs[PickerType],
  ) {
    this.pickerType = pickerType;
    this.errorReporter = config.errorReporter;
    this.stateManager = config.stateManager;
    const picker = (this.picker = MediaPicker(
      pickerType,
      config.context,
      pickerConfig,
    ));

    picker.on('uploads-start', this.handleUploadsStart);
    picker.on('upload-preview-update', this.handleUploadPreviewUpdate);
    picker.on('upload-processing', this.handleUploadProcessing);
    picker.on('upload-status-update', this.handleUploadStatusUpdate);
    picker.on('upload-finalize-ready', this.handleUploadFinalizeReady);
    picker.on('upload-error', this.handleUploadError);
    picker.on('upload-end', this.handleUploadEnd);

    if (picker instanceof Dropzone) {
      picker.on('drag-enter', this.handleDragEnter);
      picker.on('drag-leave', this.handleDragLeave);
    }

    if (picker instanceof Dropzone || picker instanceof Clipboard) {
      picker.activate();
    }
  }

  get type() {
    return this.pickerType;
  }

  destroy() {
    const { picker } = this;

    if (!picker) {
      return;
    }

    picker.removeAllListeners('uploads-start');
    picker.removeAllListeners('upload-preview-update');
    picker.removeAllListeners('upload-status-update');
    picker.removeAllListeners('upload-processing');
    picker.removeAllListeners('upload-finalize-ready');
    picker.removeAllListeners('upload-error');
    picker.removeAllListeners('upload-end');

    if (picker instanceof Dropzone) {
      picker.removeAllListeners('drag-enter');
      picker.removeAllListeners('drag-leave');
    }

    this.onStartListeners = [];
    this.onDragListeners = [];

    try {
      if (picker instanceof Dropzone || picker instanceof Clipboard) {
        picker.deactivate();
      }

      if (picker instanceof Popup || picker instanceof Browser) {
        picker.teardown();
      }
    } catch (ex) {
      this.errorReporter.captureException(ex);
    }
  }

  setUploadParams(params: UploadParams): void {
    this.picker.setUploadParams(params);
  }

  onClose(cb): () => void {
    const { picker } = this;
    if (picker instanceof Popup) {
      picker.on('closed', cb);

      return () => picker.off('closed', cb);
    }

    return () => {};
  }

  activate() {
    const { picker } = this;
    if (picker instanceof Dropzone || picker instanceof Clipboard) {
      picker.activate();
    }
  }

  deactivate() {
    const { picker } = this;
    if (picker instanceof Dropzone || picker instanceof Clipboard) {
      picker.deactivate();
    }
  }

  show(): void {
    if (this.picker instanceof Popup) {
      try {
        this.picker.show();
      } catch (ex) {
        this.errorReporter.captureException(ex);
      }
    } else if (this.picker instanceof Browser) {
      this.picker.browse();
    }
  }

  hide(): void {
    if (this.picker instanceof Popup) {
      this.picker.hide();
    }
  }

  cancel(tempId: string): void {
    if (this.picker instanceof Popup) {
      const state = this.stateManager.getState(tempId);

      if (!state || state.status === 'cancelled') {
        return;
      }

      try {
        this.picker.cancel(tempId);
      } catch (e) {
        // We're deliberately consuming a known Media Picker exception, as it seems that
        // the picker has problems cancelling uploads before the popup picker has been shown
        // TODO: remove after fixing https://jira.atlassian.com/browse/FIL-4161
        if (
          !/((popupIframe|cancelUpload).*?undefined)|(undefined.*?(popupIframe|cancelUpload))/.test(
            `${e}`,
          )
        ) {
          throw e;
        }
      }

      this.stateManager.updateState(tempId, {
        id: tempId,
        status: 'cancelled',
      });
    }
  }

  upload(url: string, fileName: string): void {
    if (this.picker instanceof BinaryUploader) {
      this.picker.upload(url, fileName);
    }
  }

  onNewMedia(cb: (states: MediaState[]) => any) {
    this.onStartListeners.push(cb);
  }

  onDrag(cb: (state: 'enter' | 'leave') => any) {
    this.onDragListeners.push(cb);
  }

  private newState = (
    file: MediaFile,
    status: MediaStateStatus,
    publicId?: string,
  ): MediaState => {
    const tempId = this.generateTempId(file.id);

    return {
      id: tempId,
      status: status,
      publicId,
      fileName: file.name,
      fileSize: file.size,
      fileMimeType: file.type,
    };
  };

  private generateTempId(id: string) {
    return `temporary:${id}`;
  }

  private handleUploadsStart = (event: UploadsStartEventPayload) => {
    const { files } = event;

    const states = files.map(file => {
      const state = this.newState(file, 'uploading');
      this.stateManager.updateState(state.id, state);
      return state;
    });

    this.onStartListeners.forEach(cb => cb.call(cb, states));
  };

  private handleUploadStatusUpdate = (
    event: UploadStatusUpdateEventPayload,
  ) => {
    const { file, progress } = event;
    const tempId = this.generateTempId(file.id);
    const currentState = this.stateManager.getState(tempId);
    const currentStatus = (currentState && currentState.status) || 'unknown';

    const state = this.newState(
      file,
      currentStatus === 'unknown' || currentStatus === 'preview'
        ? 'uploading'
        : currentStatus,
    );
    state.progress = progress && progress.portion;
    this.stateManager.updateState(state.id, state);
  };

  private handleUploadProcessing = (event: UploadProcessingEventPayload) => {
    const { file } = event;

    const state = this.newState(file, 'processing', file.publicId);
    this.stateManager.updateState(state.id, state);
  };

  private handleUploadFinalizeReady = (
    event: UploadFinalizeReadyEventPayload,
  ) => {
    const { file, finalize } = event;

    if (!finalize) {
      throw new Error(
        "Editor: Media: Picker emitted finalize-ready event but didn't provide finalize callback",
      );
    }

    const state = this.newState(file, 'unfinalized');
    state.finalizeCb = finalize;
    this.stateManager.updateState(state.id, state);
  };

  private handleUploadError = ({ error }: UploadErrorEventPayload) => {
    if (!error || !error.fileId) {
      const err = new Error(
        `Media: unknown upload-error received from Media Picker: ${error &&
          error.name}`,
      );
      this.errorReporter.captureException(err);

      return;
    }

    const tempId = this.generateTempId(error.fileId);
    this.stateManager.updateState(tempId, {
      id: tempId,
      status: 'error',
      error: error && { description: error.description, name: error.name },
    });
  };

  private handleUploadEnd = (event: UploadEndEventPayload) => {
    const { file } = event;

    const state = this.newState(file, 'ready', file.publicId);
    state.progress = 1;
    this.stateManager.updateState(state.id, state);
  };

  private handleUploadPreviewUpdate = (
    event: UploadPreviewUpdateEventPayload,
  ) => {
    const { file, preview } = event;

    const state = this.newState(file, 'preview');
    state.thumbnail = preview;
    // Add timestamp to image file names on paste @see ED-3584
    if (this.pickerType === 'clipboard' && isImage(file.type)) {
      state.fileName = appendTimestamp(file.name, file.creationDate);
    }
    this.stateManager.updateState(state.id, state);
  };

  private handleDragEnter = () => {
    this.onDragListeners.forEach(cb => cb.call(cb, 'enter'));
  };

  private handleDragLeave = () => {
    this.onDragListeners.forEach(cb => cb.call(cb, 'leave'));
  };
}
