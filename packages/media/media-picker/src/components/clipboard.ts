import { AuthProvider } from '@atlaskit/media-core';

import { LocalUploadComponent } from './localUpload';
import { MPClipboardLoaded } from '../outer/analytics/events';
import { MediaPickerContext } from '../domain/context';
import { ModuleConfig } from '../domain/config';
import * as domready from 'domready';

export interface ClipboardConfig {
  userAuthProvider?: AuthProvider;
}

export interface ClipboardConstructor {
  new (
    context: MediaPickerContext,
    config: ModuleConfig,
    clipboardConfig: ClipboardConfig,
  ): Clipboard;
}

export class Clipboard extends LocalUploadComponent {
  constructor(
    context: MediaPickerContext,
    config: ModuleConfig,
    { userAuthProvider }: ClipboardConfig = {},
  ) {
    super(context, config, userAuthProvider);
    this.context.trackEvent(new MPClipboardLoaded());
  }

  public activate(): void {
    domready(() => {
      this.deactivate();
      document.addEventListener('paste', this.pasteHandler, false);
    });
  }

  public deactivate(): void {
    document.removeEventListener('paste', this.pasteHandler);
  }

  private pasteHandler = (event: ClipboardEvent): void => {
    /*
      Browser behaviour for getting files from the clipboard is very inconsistent and buggy.
      @see https://extranet.atlassian.com/display/FIL/RFC+099%3A+Clipboard+browser+inconsistency
    */
    const filesArray = Array.prototype.slice.call(event.clipboardData.files);
    this.uploadService.addFiles(filesArray);
  };
}
