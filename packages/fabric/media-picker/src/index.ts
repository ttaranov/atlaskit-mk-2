import 'babel-polyfill';

import {
  BinaryUploader,
  BinaryUploaderConstructor,
} from './src/components/binary';
import {
  Browser,
  BrowserConfig,
  BrowserConstructor,
} from './src/components/browser';
import { Clipboard, ClipboardConstructor } from './src/components/clipboard';
import {
  Dropzone,
  DropzoneConfig,
  DropzoneConstructor,
} from './src/components/dropzone';
import { Popup, PopupConfig, PopupConstructor } from './src/components/popup';
import { ModuleConfig } from './src/domain/config';
import { UserTracker } from './src/outer/analytics/tracker';
import { handleError } from './util/handleError';

export { DropzoneUploadEventPayloadMap } from './src/components/dropzone';
export { PopupUploadEventPayloadMap } from './src/components/popup';

const trackEvent = new UserTracker().track();

// Events public API and types
export {
  UploadsStartEventPayload,
  UploadStatusUpdateEventPayload,
  UploadFinalizeReadyEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadProcessingEventPayload,
  UploadEndEventPayload,
  UploadErrorEventPayload,
  UploadEventPayloadMap,
} from './src/domain/uploadEvent';

export { MediaFile } from './src/domain/file';
export { MediaProgress } from './src/domain/progress';
export { MediaError } from './src/domain/error';
export { ImagePreview } from './src/domain/image';

export { MediaFileData } from './src/service/mediaApi';
export { FileFinalize } from './src/service/uploadService';

// Constructor public API and types
export interface MediaPickerConstructors {
  binary: BinaryUploaderConstructor;
  browser: BrowserConstructor;
  clipboard: ClipboardConstructor;
  dropzone: DropzoneConstructor;
  popup: PopupConstructor;
}

export { BinaryUploader, Browser, Clipboard, Dropzone, Popup };
export type MediaPickerComponent =
  | BinaryUploader
  | Browser
  | Clipboard
  | Dropzone
  | Popup;
export interface MediaPickerComponents {
  binary: BinaryUploader;
  browser: Browser;
  clipboard: Clipboard;
  dropzone: Dropzone;
  popup: Popup;
}

export { ModuleConfig } from './src/domain/config';

export { BrowserConfig, DropzoneConfig, PopupConfig };
export interface ComponentConfigs {
  binary?: void;
  browser: BrowserConfig;
  clipboard?: void;
  dropzone: DropzoneConfig;
  popup: PopupConfig;
}

export {
  BinaryUploaderConstructor,
  BrowserConstructor,
  ClipboardConstructor,
  DropzoneConstructor,
  PopupConstructor,
};
export type ComponentConstructor =
  | BinaryUploaderConstructor
  | BrowserConstructor
  | ClipboardConstructor
  | DropzoneConstructor
  | PopupConstructor;

// returns component constructor when just supplied with component name
export function MediaPicker<K extends keyof MediaPickerComponents>(
  componentName: K,
): MediaPickerConstructors[K];

// returns component instance when supplied with component name and module config
export function MediaPicker<K extends keyof MediaPickerComponents>(
  componentName: K,
  moduleConfig: ModuleConfig,
  pickerConfig?: ComponentConfigs[K],
): MediaPickerComponents[K];

export function MediaPicker<K extends keyof MediaPickerComponents>(
  componentName: K,
  moduleConfig?: ModuleConfig,
  pickerConfig?: ComponentConfigs[K],
): MediaPickerComponents[K] | MediaPickerConstructors[K] {
  if (moduleConfig) {
    const context = { trackEvent };

    switch (componentName) {
      case 'binary':
        return new BinaryUploader(context, moduleConfig);
      case 'browser':
        return new Browser(context, moduleConfig, pickerConfig as
          | BrowserConfig
          | undefined);
      case 'clipboard':
        return new Clipboard(context, moduleConfig);
      case 'dropzone':
        return new Dropzone(context, moduleConfig, pickerConfig as
          | DropzoneConfig
          | undefined);
      case 'popup':
        return new Popup(context, moduleConfig, pickerConfig as PopupConfig);
      default:
        const message = `The component ${componentName} does not exist`;
        handleError('wrong_component', message);
        throw new Error(message);
    }
  } else {
    const constructors = {
      binary: BinaryUploader,
      browser: Browser,
      clipboard: Clipboard,
      dropzone: Dropzone,
      popup: Popup,
    };

    return constructors[componentName];
  }
}
