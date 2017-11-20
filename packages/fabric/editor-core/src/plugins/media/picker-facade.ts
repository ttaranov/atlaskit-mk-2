import {
  MediaPicker,
  ModuleConfig,
  MediaPickerComponent,
  MediaPickerComponents,
  ComponentConfigs,
  Popup,
  Browser,
  Dropzone,
  Clipboard,
  BinaryUploader,
  UploadsStartPayload,
  UploadPreviewUpdatePayload,
  UploadStatusUpdatePayload,
  UploadProcessingPayload,
  UploadFinalizeReadyPayload,
  UploadErrorPayload,
  UploadEndPayload,
  SerialisedMediaFile,
} from 'mediapicker';
import {
  ContextConfig,
  MediaStateManager,
  MediaState,
  UploadParams,
  MediaStateStatus,
} from '@atlaskit/media-core';

import { ErrorReportingHandler } from '../../utils';

export type PickerType = keyof MediaPickerComponents;

export default class PickerFacade {
  private picker: MediaPickerComponent;
  private onStartListeners: Array<(states: MediaState[]) => void> = [];
  private onDragListeners: Array<Function> = [];
  private errorReporter: ErrorReportingHandler;
  private uploadParams: UploadParams;

  constructor(
    pickerType: PickerType,
    uploadParams: UploadParams,
    contextConfig: ContextConfig,
    private stateManager: MediaStateManager,
    errorReporter: ErrorReportingHandler,
    mediaPickerFactory?: (
      pickerType: PickerType,
      moduleConfig: ModuleConfig,
      componentConfig?: ComponentConfigs[PickerType],
    ) => MediaPickerComponents[PickerType],
  ) {
    this.errorReporter = errorReporter;
    this.uploadParams = uploadParams;

    if (!mediaPickerFactory) {
      mediaPickerFactory = MediaPicker;
    }

    let componentConfig;

    if (pickerType === 'dropzone') {
      componentConfig = {
        container: this.getDropzoneContainer(),
        headless: true,
      };
    } else if (pickerType === 'popup') {
      if (contextConfig.userAuthProvider) {
        componentConfig = { userAuthProvider: contextConfig.userAuthProvider };
      } else {
        pickerType = 'browser';
      }
    }

    const picker = (this.picker = mediaPickerFactory!(
      pickerType,
      this.buildPickerConfigFromContext(contextConfig),
      componentConfig,
    ));

    picker.on('uploads-start', this.handleUploadsStart);
    picker.on('upload-preview-update', this.handleUploadPreviewUpdate);
    picker.on('upload-status-update', this.handleUploadStatusUpdate);
    picker.on('upload-processing', this.handleUploadProcessing);
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

  get pickerType() {
    return this.picker.type;
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
    this.uploadParams = params;
    this.picker.setUploadParams(params);
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

  private newState = (file: SerialisedMediaFile, status: MediaStateStatus) => {
    const tempId = this.generateTempId(file.id);

    return {
      id: tempId,
      status: status,
      publicId: file.publicId,
      fileName: file.name,
      fileSize: file.size,
      fileMimeType: file.type,
    };
  };

  private buildPickerConfigFromContext(context: ContextConfig): ModuleConfig {
    return {
      uploadParams: this.uploadParams,
      apiUrl: context.serviceHost,
      authProvider: context.authProvider,
    };
  }

  private getDropzoneContainer() {
    const { dropzoneContainer } = this.uploadParams;

    return dropzoneContainer ? dropzoneContainer : document.body;
  }

  private generateTempId(id: string) {
    return `temporary:${id}`;
  }

  private handleUploadsStart = (event: UploadsStartPayload) => {
    const { files } = event;

    const states = files.map(file => {
      const state = this.newState(file, 'uploading');
      this.stateManager.updateState(state.id, state);
      return state;
    });

    this.onStartListeners.forEach(cb => cb.call(cb, states));
  };

  private handleUploadStatusUpdate = (event: UploadStatusUpdatePayload) => {
    const { file, progress } = event;
    const tempId = this.generateTempId(file.id);
    const currentState = this.stateManager.getState(tempId);
    const currentStatus =
      currentState && currentState.status ? currentState.status : 'unknown';

    const state = this.newState(
      file,
      currentStatus === 'unknown' ? 'uploading' : currentStatus,
    );
    state['progress'] = progress ? progress.portion : undefined;
    this.stateManager.updateState(state.id, state);
  };

  private handleUploadProcessing = (event: UploadProcessingPayload) => {
    const { file } = event;

    const state = this.newState(file, 'processing');
    this.stateManager.updateState(state.id, state);
  };

  private handleUploadFinalizeReady = (event: UploadFinalizeReadyPayload) => {
    const { file, finalize } = event;

    if (!finalize) {
      throw new Error(
        "Editor: Media: Picker emitted finalize-ready event but didn't provide finalize callback",
      );
    }

    const state = this.newState(file, 'unfinalized');
    state['finalizeCb'] = finalize;
    this.stateManager.updateState(state.id, state);
  };

  private handleUploadError = ({ error }: UploadErrorPayload) => {
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
      error: error
        ? { description: error!.description, name: error!.name }
        : undefined,
    });
  };

  private handleUploadEnd = (event: UploadEndPayload) => {
    const { file } = event;

    const state = this.newState(file, 'ready');
    this.stateManager.updateState(state.id, state);
  };

  private handleUploadPreviewUpdate = (event: UploadPreviewUpdatePayload) => {
    const { file, preview } = event;

    if (preview !== undefined) {
      const state = this.newState(file, 'uploading');
      state['thumbnail'] = preview;
      this.stateManager.updateState(state.id, state);
    }
  };

  private handleDragEnter = () => {
    this.onDragListeners.forEach(cb => cb.call(cb, 'enter'));
  };

  private handleDragLeave = () => {
    this.onDragListeners.forEach(cb => cb.call(cb, 'leave'));
  };
}
