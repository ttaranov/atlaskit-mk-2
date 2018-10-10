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
  UploadPreviewUpdateEventPayload,
  UploadEndEventPayload,
  UploadParams,
} from '@atlaskit/media-picker';
import { Context } from '@atlaskit/media-core';

import { ErrorReportingHandler } from '@atlaskit/editor-common';
import { MediaStateManager, MediaState, CustomMediaPicker } from './types';

export type PickerType = keyof MediaPickerComponents | 'customMediaPicker';
export type ExtendedComponentConfigs = ComponentConfigs & {
  customMediaPicker: CustomMediaPicker;
};

export type PickerFacadeConfig = {
  context: Context;
  stateManager: MediaStateManager;
  errorReporter: ErrorReportingHandler;
};

export default class PickerFacade {
  private picker: MediaPickerComponent | CustomMediaPicker;
  private onStartListeners: Array<(states: MediaState[]) => void> = [];
  private onDragListeners: Array<Function> = [];
  private errorReporter: ErrorReportingHandler;
  private pickerType: PickerType;
  private stateManager: MediaStateManager;

  constructor(
    pickerType: PickerType,
    config: PickerFacadeConfig,
    pickerConfig?: ExtendedComponentConfigs[PickerType],
  ) {
    this.pickerType = pickerType;
    this.errorReporter = config.errorReporter;
    this.stateManager = config.stateManager;

    let picker;
    if (pickerType === 'customMediaPicker') {
      picker = this.picker = pickerConfig as CustomMediaPicker;
    } else {
      picker = this.picker = MediaPicker(
        pickerType,
        config.context,
        pickerConfig as any,
      );
    }

    // picker.on('uploads-start', this.handleUploadsStart);
    picker.on('upload-preview-update', this.handleUploadPreviewUpdate);
    // picker.on('upload-status-update', this.handleUploadPreviewUpdate);
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

    (picker as any).removeAllListeners('uploads-start');
    // (picker as any).removeAllListeners('upload-preview-update');
    (picker as any).removeAllListeners('upload-end');

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

    // this.deferredDimensions.clear();
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

  cancel(id: string): void {
    if (this.picker instanceof Popup) {
      const state = this.stateManager.getState(id);

      if (!state || state.status === 'cancelled') {
        return;
      }

      try {
        this.picker.cancel(id);
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

      this.stateManager.updateState(id, {
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

  private handleUploadEnd = async (event: UploadEndEventPayload) => {
    this.stateManager.updateState(event.file.id, {
      status: 'ready',
    });
  };

  private handleUploadPreviewUpdate = (
    event: UploadPreviewUpdateEventPayload,
  ) => {
    const { file, preview } = event;
    const states = this.stateManager.newState(file.id, {
      fileName: file.name,
      fileSize: file.size,
      fileMimeType: file.type,
      fileId: file.upfrontId,
      dimensions: preview && preview.dimensions,
      status: 'ready',
    });

    file.upfrontId &&
      file.upfrontId.then(data => {
        this.stateManager.updateState(file.id, {
          status: 'ready',
          publicId: data,
        });
      });

    this.onStartListeners.forEach(cb => cb.call(cb, [states]));
  };

  private handleDragEnter = () => {
    this.onDragListeners.forEach(cb => cb.call(cb, 'enter'));
  };

  private handleDragLeave = () => {
    this.onDragListeners.forEach(cb => cb.call(cb, 'leave'));
  };
}
