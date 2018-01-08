import 'babel-polyfill';

import { BinaryUploader, BinaryUploaderConstructor } from './components/binary';
import {
  Browser,
  BrowserConfig,
  BrowserConstructor,
} from './components/browser';
import {
  Clipboard,
  ClipboardConstructor,
  ClipboardConfig,
} from './components/clipboard';
import {
  Dropzone,
  DropzoneConfig,
  DropzoneConstructor,
} from './components/dropzone';
import { Popup, PopupConfig, PopupConstructor } from './components/popup';
import { ModuleConfig } from './domain/config';
import { UserTracker } from './outer/analytics/tracker';
import { handleError } from './util/handleError';

export { DropzoneUploadEventPayloadMap } from './components/dropzone';
export { PopupUploadEventPayloadMap } from './components/popup';

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
} from './domain/uploadEvent';

export { MediaFile } from './domain/file';
export { MediaProgress } from './domain/progress';
export { MediaError } from './domain/error';
export { ImagePreview, Preview, NonImagePreview } from './domain/preview';

export { MediaFileData } from './service/mediaApi';
export { FileFinalize } from './service/uploadService';

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

export { ModuleConfig } from './domain/config';

export { BrowserConfig, DropzoneConfig, PopupConfig };
export interface ComponentConfigs {
  binary?: void;
  browser: BrowserConfig;
  clipboard: ClipboardConfig;
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
        return new Clipboard(context, moduleConfig, pickerConfig as
          | ClipboardConfig
          | undefined);
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
